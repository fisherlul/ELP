module Display exposing (display)

import Svg exposing (Svg, svg, line)
import Svg.Attributes exposing (..)
import Parsing exposing (Movement(..))


-- A TcTurtle program is a list of instructions
type alias Program =
    List Movement



-- Turtle state: current position and orientation (in degrees)
type alias Turtle =
    { x : Float
    , y : Float
    , angleDeg : Float
    }


-- A line segment produced by a Forward instruction
type alias Segment =
    { x1 : Float, y1 : Float, x2 : Float, y2 : Float }


-- Convert a TcTurtle program into an SVG element
display : Program -> Svg msg
display program =
    let
        -- Initial turtle state (start from the center of the canvas)
        start : Turtle
        start =
            { x = 250, y = 250, angleDeg = 0 }

        -- Execute the program and collect all produced line segments
        segments : List Segment
        segments =
            program
                |> execProgram start
                |> .segments

        -- Fixed SVG viewBox (simple and robust choice)
        vb =
            "0 0 500 500"
    in
    svg
        [ viewBox vb
        , width "500"
        , height "500"
        ]
        (List.map segmentToSvgLine segments)


-- Result of executing a program:
-- final turtle state + list of generated segments
type alias ExecResult =
    { turtle : Turtle
    , segments : List Segment
    }


-- Execute a TcTurtle program starting from a given turtle state
execProgram : Turtle -> Program -> ExecResult
execProgram turtle program =
    List.foldl execInstruction { turtle = turtle, segments = [] } program
        |> reverseSegments


-- Segments are accumulated in reverse order using (::),
-- so we reverse them at the end for correct drawing order
reverseSegments : ExecResult -> ExecResult
reverseSegments result =
    { result | segments = List.reverse result.segments }


-- Execute a single instruction and update the execution result
execInstruction : Movement -> ExecResult -> ExecResult
execInstruction instr result =
    case instr of
        Forward d ->
            let
                ( newTurtle, seg ) =
                    forward d result.turtle
            in
            { turtle = newTurtle
            , segments = seg :: result.segments
            }

        Left a ->
            { result | turtle = turn (-(toFloat a)) result.turtle }

        Right a ->
            { result | turtle = turn (toFloat a) result.turtle }

        Repeat n inner ->
            repeatExec n inner result


-- Execute a sub-program n times (used for Repeat)
repeatExec : Int -> Program -> ExecResult -> ExecResult
repeatExec n inner result =
    if n <= 0 then
        result
    else
        let
            afterOnce =
                execProgram result.turtle inner

            merged =
                { turtle = afterOnce.turtle
                , segments = List.reverse afterOnce.segments ++ result.segments
                }
        in
        repeatExec (n - 1) inner merged


-- Rotate the turtle by a given angle (in degrees)
turn : Float -> Turtle -> Turtle
turn deltaDeg turtle =
    { turtle | angleDeg = turtle.angleDeg + deltaDeg }


-- Move the turtle forward and produce a line segment
forward : Int -> Turtle -> ( Turtle, Segment )
forward d turtle =
    let
        dist =
            toFloat d

        -- Convert degrees to radians for trigonometric functions
        rad =
            degreesToRadians turtle.angleDeg

        x2 =
            turtle.x + dist * cos rad

        y2 =
            turtle.y + dist * sin rad

        newTurtle =
            { turtle | x = x2, y = y2 }

        seg =
            { x1 = turtle.x, y1 = turtle.y, x2 = x2, y2 = y2 }
    in
    ( newTurtle, seg )


-- Convert degrees to radians
degreesToRadians : Float -> Float
degreesToRadians deg =
    deg * pi / 180


-- Convert a line segment into an SVG <line> element
segmentToSvgLine : Segment -> Svg msg
segmentToSvgLine s =
    line
        [ x1 (floatToStr s.x1)
        , y1 (floatToStr s.y1)
        , x2 (floatToStr s.x2)
        , y2 (floatToStr s.y2)
        , stroke "black"
        , strokeWidth "2"
        , strokeLinecap "round"
        ]
        []


-- Convert a Float to a String (required by SVG attributes)
floatToStr : Float -> String
floatToStr f =
    String.fromFloat f
