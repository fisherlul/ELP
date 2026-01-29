module Parsing exposing (Movement(..), read)

import Parser exposing (..)


type Movement
    = Repeat Int (List Movement)
    | Forward Int
    | Left Int
    | Right Int


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


program : Parser (List Movement)
program =

    sequence
        { start = "["
        , separator = ","
        , end = "]"
        , spaces = spaces
        , item = movement
        , trailing = Forbidden -- Interdit la virgule finale (ex: [Forward 10,] est invalide)
        }


-- PARSER D’UN MOUVEMENT (récursif)

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


-- PARSERS DES CONSTRUCTEURS

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
