package server

import (
	"bufio"
	"fmt"
	"net"
)

func handleClient(conn net.Conn) {
	defer conn.Close() // Ensure connection is closed when done

	reader := bufio.NewReader(conn)
	msg, err := reader.ReadString('\n')
	if err != nil {
		return
	}

	fmt.Fprintf(conn, "Received: %s", msg)
}