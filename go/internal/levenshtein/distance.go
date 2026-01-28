package levenshtein

import "github.com/agnivade/levenshtein"

func Distance(a, b string) int {
	return levenshtein.ComputeDistance(a, b)
}