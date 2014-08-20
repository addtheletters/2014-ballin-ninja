#pragma strict

var TRIGGERKEY : String;

function Start () {
	TRIGGERKEY = "b";
}

function Update () {
	if(Input.GetKeyDown(TRIGGERKEY)){
		//do something
	}
}

function Get4Bisectors( corners: Vector2[] ){
	var ordered = DataMaker.GetOrderedPoints(corners);
	//figure out bisectors
}

function GetBisector( pA : Vector2, pB : Vector2 ){
	var delta 	: Vector2 = pB - pA;
	var midpoint: Vector2 = pA + delta;
	
	var slope	: double = delta.y / delta.x;
	var bSlope	: double = -1 / slope;
	
	return [midpoint, bSlope];
}

function DisplayBisector( bMidpoint : Vector2, bSlope : double, length : double, zdistance : double, color : Color ){
	//bisector is a list containing a Vector2 (midpt) and then a double (slope)
	var theta = Mathf.Atan( bSlope );
	var dx = Mathf.Cos(theta) * length;
	var dy = Mathf.Sin(theta) * length;
	var startpt = Vector3( bMidpoint.x - dx/2, bMidpoint.y - dy/2,  zdistance);
	var endpt	= Vector3( bMidpoint.x + dx/2, bMidpoint.y + dx/2,  zdistance);
	Debug.DrawLine(startpt, endpt, color);
}
