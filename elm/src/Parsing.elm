module Parsing exposing (Movement(..), read)

import Parser exposing (..)


-- 1) TYPES

type Movement
    = Repeat Int (List Movement)
    | Forward Int
    | Left Int
    | Right Int


-- 2) FONCTION PUBLIQUE

read : String -> Result (List DeadEnd) (List Movement)
read input =
    run mainParser input


-- Parser principal qui gère les espaces avant/après et la fin du fichier
mainParser : Parser (List Movement)
mainParser =
    succeed identity
        |. spaces
        |= program
        |. spaces
        |. end


-- 3) PARSER D’UN PROGRAMME = une liste entre crochets

program : Parser (List Movement)
program =
    -- Utilisation de 'sequence' pour remplacer votre 'bracketList' et 'sepBy' manuel
    sequence
        { start = "["
        , separator = ","
        , end = "]"
        , spaces = spaces
        , item = movement
        , trailing = Forbidden -- Interdit la virgule finale (ex: [Forward 10,] est invalide)
        }


-- 4) PARSER D’UN MOUVEMENT (récursif)

movement : Parser Movement
movement =
    lazy <|
        \_ ->
            oneOf
                [ repeatP
                , forwardP
                , leftP
                , rightP
                ]


-- 5) PARSERS DES CONSTRUCTEURS

repeatP : Parser Movement
repeatP =
    succeed Repeat
        |. keyword "Repeat"
        |. spaces
        |= int
        |. spaces
        |= program -- Appel récursif


forwardP : Parser Movement
forwardP =
    succeed Forward
        |. keyword "Forward"
        |. spaces
        |= int


leftP : Parser Movement
leftP =
    succeed Left
        |. keyword "Left"
        |. spaces
        |= int


rightP : Parser Movement
rightP =
    succeed Right
        |. keyword "Right"
        |. spaces
        |= int