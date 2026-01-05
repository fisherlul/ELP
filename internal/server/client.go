package server

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net"

	"ELP/internal/protocol"
	"ELP/internal/worker"
)

func handleClient(conn net.Conn) {
	defer conn.Close()

	reader := bufio.NewReader(conn)

	// Protocol: 1 JSON request per line (newline terminated)
	line, err := reader.ReadBytes('\n')
	if err != nil {
		return
	}

	var req protocol.Request
	if err := json.Unmarshal(line, &req); err != nil {
		_ = writeJSONLine(conn, protocol.Response{
			Ok:    false,
			Error: "invalid JSON request",
		})
		return
	}

	// Defaults
	if req.Workers <= 0 {
		req.Workers = 8
	}
	if req.Threshold <= 0 {
		req.Threshold = 2
	}

	// Build jobs: all pairs (A x B)
	jobs := make(chan worker.Job, 1024)
	results := make(chan worker.Result, 1024)

	pool := worker.NewPool(req.Workers, jobs, results)
	pool.Start()

	totalPairs := len(req.NamesA) * len(req.NamesB)
	go func() {
		for _, a := range req.NamesA {
			for _, b := range req.NamesB {
				jobs <- worker.Job{A: a, B: b}
			}
		}
		close(jobs)
	}()

	// Collect results
	matches := make([]protocol.Match, 0, 64)
	for i := 0; i < totalPairs; i++ {
		res := <-results
		if res.Distance <= req.Threshold {
			matches = append(matches, protocol.Match{
				A:        res.A,
				B:        res.B,
				Distance: res.Distance,
			})
		}
	}

	pool.Stop()

	resp := protocol.Response{
		Ok:         true,
		TotalPairs: totalPairs,
		Matches:    matches,
	}
	_ = writeJSONLine(conn, resp)
}

func writeJSONLine(conn net.Conn, v any) error {
	b, err := json.Marshal(v)
	if err != nil {
		return err
	}
	_, err = fmt.Fprintf(conn, "%s\n", string(b))
	return err
}
