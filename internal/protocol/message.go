package protocol

type Request struct {
	NamesA    []string `json:"namesA"`
	NamesB    []string `json:"namesB"`
	Threshold int      `json:"threshold"` // keep matches with distance <= threshold
	Workers   int      `json:"workers"`   // number of goroutines in worker pool
}

type Match struct {
	A        string `json:"a"`
	B        string `json:"b"`
	Distance int    `json:"distance"`
}

type Response struct {
	Ok         bool    `json:"ok"`
	Error      string  `json:"error,omitempty"`
	TotalPairs int     `json:"totalPairs,omitempty"`
	Matches    []Match `json:"matches,omitempty"`
}