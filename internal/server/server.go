package server

import (
	"log"
	"net"
)

func Start(addr string) {
	ln, err := net.Listen("tcp", addr) // create server listening on addr
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Server listening on", addr)

	for { // accept incoming client connections, concurrently handle each client
		conn, err := ln.Accept()
		if err != nil {
			continue
		}  
		go handleClient(conn)
	}
}