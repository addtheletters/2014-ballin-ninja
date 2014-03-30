#pragma strict

import System;
import System.IO;

var quadScreen : GameObject;
var points : Vector3[];

var pseudoCam : PseudoCam;

var PHISTEP 	: double;
var THETASTEP 	: double;

var theta	: double; //y rotation
var phi		: double; //x rotation

var filename : String;

function Start () {
	if(PHISTEP == 0) 	PHISTEP 	= 1;
	if(THETASTEP == 0) 	THETASTEP 	= 1;
	filename = "data.txt";
	pseudoCam = GetComponent("PseudoCam") as PseudoCam;
}

function Update () {
	if(Input.GetMouseButtonDown(1)){
		CalculateAndPrintData();
	}
}

function GetPoints(){
	//var quadTrans 	= quadScreen.transform;
	quadScreen.transform.eulerAngles.y = theta;
	quadScreen.transform.eulerAngles.x = phi;
	quadScreen.transform.eulerAngles.z = 0;
	
	return pseudoCam.TakeImage();
}

static function GetAngle( v0:Vector3, v1:Vector3, v2:Vector3 ){
	var w1:Vector3 = v1 - v0;
	var w2:Vector3 = v2 - v0;
	return Vector3.Angle(w1, w2);
}

static function RoundData(data: double[], digits: int ){
	var i:int;
	for(i = 0; i < data.length; i++){
		data[i] = Mathf.Round(data[i] * Math.Pow(10, digits)) / Math.Pow(10, digits);
	}
}

static function GetData( points : Vector3[] ){
	var ordered: Vector3[] = new Vector3[4];
	var min1: double = 999999999;
	var min2: double = min1;
	var pos1: int;
	var pos2: int;
	var i: int;
	for(i=0;i<4;i++){
		if(min1>points[i].x){
			min1=points[i].x;
			pos1=i;
			if(min2>points[i].x){
				min1=min2;
				pos1=pos2;
				min2=points[i].x;
				pos2=i;
			}
		}
	}
	if(points[pos1].y>points[pos2].y){
		ordered[0]=points[pos1];
		ordered[2]=points[pos2];
	}
	else{
		ordered[2]=points[pos2];
		ordered[0]=points[pos1];
	}
	var pos3 : int =-1;
	var pos4 : int =-1;
	for(i=0;i<4;i++){
		if( (i!=pos1) && (i!=pos2)){
			if(pos3==-1){
				pos3=i;
			}
			else{
				pos4=i;
			}
		}
	}
	if(points[pos3].y>points[pos4].y){
		ordered[1]=points[pos3];
		ordered[3]=points[pos4];
	}
	else{
		ordered[3]=points[pos4];
		ordered[1]=points[pos3];
	}
	var toplen 		: double = Vector3.Distance(ordered[0], ordered[1]);
	var bottlen 	: double = Vector3.Distance(ordered[2], ordered[3]);
	var leftlen 	: double = Vector3.Distance(ordered[0], ordered[2]);
	var rightlen 	: double = Vector3.Distance(ordered[1], ordered[3]);
	
	var tbRatio	: double = toplen / bottlen;
	var rlRatio	: double = rightlen / leftlen;
	
	var tlRatio : double = toplen / leftlen;
	var rbRatio : double = rightlen / bottlen;
	/*var alpha : double[] = new double[4];
	alpha[0] = GetAngle( ordered[0], ordered[1], ordered[2] );
	alpha[1] = GetAngle( ordered[1], ordered[0], ordered[3] );
	alpha[2] = GetAngle( ordered[2], ordered[3], ordered[0] );
	alpha[3] = GetAngle( ordered[3], ordered[2], ordered[1] );
	*/
	var diag1 : double = Vector3.Distance(ordered[0], ordered[3]); //choosing just one of the diagonals to get a measure of size
	var diag2 : double = Vector3.Distance(ordered[1], ordered[2]);
	
	//return [ tbRatio, rlRatio, alpha[0], alpha[1], alpha[2], alpha[3], diag1 + diag2 ];
	return [ tbRatio, rlRatio, tlRatio, rbRatio, diag1 + diag2 ];
}

function CalculateAndPrintData(){
	
	var file = File.CreateText(filename);
	
	for( phi = -60; phi <= 60; phi += PHISTEP ){
		for(theta = -60; theta <= 60; theta += THETASTEP){
			var data : double[] = GetData( GetPoints() );
			RoundData(data, 4);
			file.WriteLine("{0} {1} {2} {3} {4} {5} {6}", phi, theta,
			 data[0], data[1], data[2], data[3], data[4]);
		}
	}
	Debug.Log("Done Calculating!");
	file.Close();
	Debug.Log(phi + " " + theta);
}
