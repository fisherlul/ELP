package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net"

	"ELP/internal/protocol"
)

func main() {
	conn, err := net.Dial("tcp", "127.0.0.1:9000")
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	req := protocol.Request{
		NamesA:    []string{"Alex"},
		NamesB:    []string{"Alex", "Alec", "Alexa", "Alexander"},
		Threshold: 2,
		Workers:   8,
	}

	b, _ := json.Marshal(req)
	fmt.Fprintf(conn, "%s\n", string(b))

	reader := bufio.NewReader(conn)
	line, err := reader.ReadString('\n')
	if err != nil {
		panic(err)
	}

	fmt.Println("Server response:", line)
}
