#pragma strict

var cam : GameObject;
var pptheta : double;
var ppphi : double;
var pprad: double;

// "Screen" is assumed to be centered at 0,0,0.
// This script goes on the pivot

function Start () {

}

function Update () {
	/*if(Input.GetMouseButtonDown(0)){
		Reposition(ppphi, pptheta, pprad);
	}
	if(Input.GetMouseButtonDown(1)){
		Reposition(-ppphi, -pptheta, 2*pprad);
	}*/
}

function Reposition( phi:double, theta:double, rad:double ){
	cam.transform.localPosition = new Vector3(0, 0, -rad);
	transform.eulerAngles = new Vector3(0, 0, 0);
	transform.Rotate(-phi, -theta, 0);
	pprad = rad;
	pptheta = theta;
	ppphi = phi;
	//Debug.Log(transform.eulerAngles);
	//Debug.Log("Repositioned camera, maybe.");
}
