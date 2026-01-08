package worker

import (
	"sync"

	"ELP/internal/levenshtein"
)

type Pool struct {
	workers int
	jobs    <-chan Job
	results chan<- Result

	wg sync.WaitGroup
}

func NewPool(workers int, jobs <-chan Job, results chan<- Result) *Pool {
	return &Pool{
		workers: workers,
		jobs:    jobs,
		results: results,
	}
}

func (p *Pool) Start() {
	for i := 0; i < p.workers; i++ {
		p.wg.Add(1)
		go func() {
			defer p.wg.Done()
			for job := range p.jobs {
				d := levenshtein.Distance(job.A, job.B)
				p.results <- Result{A: job.A, B: job.B, Distance: d}
			}
		}()
	}
}

func (p *Pool) Stop() {
	// Wait for all workers to finish after jobs channel is closed.
	p.wg.Wait()
}
