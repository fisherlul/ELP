module Main exposing (main)

import Browser
import Display
import Html exposing (Html, button, div, input, text)
import Html.Attributes exposing (placeholder, style, value)
import Html.Events exposing (onClick, onInput)
import Html.Keyed
import Parsing
import Svg


-- MODEL
type alias Model =
    { inputContent : String
    , program : Maybe (List Parsing.Movement)
    , error : Maybe String
    }


init : Model
init =
    { inputContent = ""
    , program = Nothing
    , error = Nothing
    }


-- UPDATE
type Msg
    = UserTyped String
    | Draw


update : Msg -> Model -> Model
update msg model =
    case msg of
        UserTyped val ->
            { model | inputContent = val }

        Draw ->
            case Parsing.read model.inputContent of
                Ok ast ->
                    { model | program = Just ast, error = Nothing }

                Err _ ->
                    { model | error = Just "Invalid TcTurtle Code", program = Nothing }


-- VIEW
view : Model -> Html Msg
view model =
    div []
        [ input
            [ placeholder "e.g., [Repeat 4 [Forward 50, Left 90]]"
            , value model.inputContent
            , onInput UserTyped
            , style "width" "400px"
            , style "padding" "10px"
            ]
            []
        , button [ onClick Draw, style "margin-left" "10px" ] [ text "Render Turtle" ]
        , renderError model.error
        , div [ style "margin-top" "20px", style "border" "1px solid #ccc" ]
            [ case model.program of
                Just prg ->
                    -- Display.display returns Svg msg, wrap it in Html
                    Html.Keyed.node "div" [] [ ( "svg", Svg.map (always Draw) (Display.display prg) ) ]

                Nothing ->
                    div [ style "padding" "50px", style "color" "#999" ]
                        [ text "Enter a program and click Run to see the turtle move!" ]
            ]
        ]


renderError : Maybe String -> Html msg
renderError maybeErr =
    case maybeErr of
        Nothing ->
            text ""

        Just e ->
            div [ style "color" "red", style "margin-top" "10px" ] [ text e ]


-- MAIN
main =
    Browser.sandbox { init = init, update = update, view = view }
