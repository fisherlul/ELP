package worker

import (
	"go-levenshtein/internal/levenshtein"
	"sync"
)

type Pool struct {
	workers int
	jobs    <-chan Job    // send-only channel
	results chan<- Result // receive-only channel
	wg	  sync.WaitGroup
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
		p.wg.Go(func() {
			for job := range p.jobs {
				d := levenshtein.Distance(job.A, job.B)
				p.results <- Result{A: job.A, B: job.B, Distance: d}
			}
		})
	}
}

func (p *Pool) Wait() {
	p.wg.Wait()
}

func (p* Pool) Stop() {
	close(p.results)
}