package worker

type Job struct {
	A string
	B string
}

type Result struct {
	A        string
	B        string
	Distance int
}

type Worker interface {
	Compute(job Job) Result
}