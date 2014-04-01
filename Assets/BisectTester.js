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

function GetBisector( pA : Vector2, pB : Vector2 ){
	var delta 	: Vector2 = pB - pA;
	var midpoint: Vector2 = pA + delta;
	
	var slope	: double = delta.y / delta.x;
	var bSlope	: double = -1 / slope;
	
	return [midpoint, bSlope];
}

function DisplayBisector( bisector, length ){
	
	
	//Debug.DrawLine();
	
}
