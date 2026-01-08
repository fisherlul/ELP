package server

import (
	"bufio"
	"fmt"
	"go-levenshtein/internal/protocol"
	"net"
)

func handleClient(conn net.Conn) {
	defer conn.Close() // Ensure connection is closed when done

	reader := bufio.NewReader(conn)
	msg, err := reader.ReadBytes('\n')
	if err != nil {
		return
	}
	var req protocol.Request

	fmt.Fprintf(conn, "Received: %s", msg)
}