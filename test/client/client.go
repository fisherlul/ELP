package main

import (
	"fmt"
	"net"
)

func main() {
	conn, err := net.Dial("tcp", "127.0.0.1:9000") // connect to server through port 9000
	if err != nil {
		panic(err)
	}
	fmt.Fprintln(conn, "hello server") // if successful

	buf := make([]byte, 1024) // read response from server
	n, _ := conn.Read(buf) 
	fmt.Println(string(buf[:n])) // print response
}
