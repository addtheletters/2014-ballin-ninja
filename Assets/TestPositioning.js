#pragma strict

//file should be deprecated now


var guessRepresentation : GameObject;

var atext		: TextAsset;
var dataset		: double[,];
var currentdata : double[];


function Start () {
	var datatext	: String[];
	var datatextset	: Array;
	
	datatext = atext.text.Split("\n"[0]);
	datatextset = new Array(datatext.length);
	//dataset		= new Array(datatext.length);
	var i : int;
	var j : int;
	for( i = 0; i < datatext.length; i++ ){
		datatextset[i] = (datatext[i]).Split("\n"[0]);
	}
	for( i = 0; i < datatextset.length; i++ ){
		//dataset[i] = new Array(9);
		for(j = 0; j < 9; j++){
			//dataset[i,j] = double.Parse( (datatextset[i] as Array)[j] );
			Debug.Log("THIS IS DEPRECATED");
		}
	}
}

function Update () {

}

//takes [tb, rl, a0, a1, a2, a3, omega]
//returns [phi, theta, r]
function getOriginalParams( data : double[] ){
	var ret : double[] = new double[3];
	
	
	
	
	return ret;
}

function DetermineOriginal( points : Vector3[] ){
	currentdata = DataMaker.GetData(points);
	return getOriginalParams(currentdata);
}

