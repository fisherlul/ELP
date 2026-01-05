package levenshtein

// Distance computes Levenshtein distance between two strings (Unicode-safe).
func Distance(a, b string) int {
	ar := []rune(a)
	br := []rune(b)

	la := len(ar)
	lb := len(br)

	if la == 0 {
		return lb
	}
	if lb == 0 {
		return la
	}

	// dp row optimization: only keep previous row
	prev := make([]int, lb+1)
	curr := make([]int, lb+1)

	for j := 0; j <= lb; j++ {
		prev[j] = j
	}

	for i := 1; i <= la; i++ {
		curr[0] = i
		for j := 1; j <= lb; j++ {
			cost := 0
			if ar[i-1] != br[j-1] {
				cost = 1
			}
			del := prev[j] + 1
			ins := curr[j-1] + 1
			sub := prev[j-1] + cost
			curr[j] = min3(del, ins, sub)
		}
		prev, curr = curr, prev
	}

	return prev[lb]
}

func min3(a, b, c int) int {
	if a < b {
		if a < c {
			return a
		}
		return c
	}
	if b < c {
		return b
	}
	return c
}
