#pragma strict

var corners : Vector3[];
var outs 	: Vector3[];
var quadScreen 		: GameObject;
var rayInterceptor	: GameObject;

var bstNotThatOne : BisectTester;

private var ready		: boolean;
private var succeeded	: boolean;
//assumes camera is centered relative to the image it's taking
//and some units away in the z direction from the image

function Start () {
	RefreshQuadScreen();
	ready = true;
}

function RefreshQuadScreen(){
	var quadTrans 	= quadScreen.transform;
	var mesh: Mesh = quadScreen.GetComponent(MeshFilter).mesh;
	corners = mesh.vertices;
	
	var i : int;
	for(i = 0; i < corners.length; i++){
		//Debug.Log(corners[i]);
		corners[i] = quadTrans.TransformPoint( corners[i] );
		//Debug.Log(corners.length);
	}
}

function Update () {
	if(ready){
		if(Input.GetMouseButtonDown(0)){
			outs = TakeImage();
		}
	}	
	if(succeeded){
		var i: int;
		for(i = 0; i < outs.length; i++){
			Debug.DrawLine(transform.position, outs[i], Color.blue);
		}
	}
}

function TakeImage(){
	RefreshQuadScreen();
	
	var outArray : Vector3[]	=	new Vector3[corners.length];
	var hitinfo : RaycastHit;
	//for all corners. Really, corners.length should be 4 always
	var i : int;
	for( i = 0; i < corners.length; i++){
		var rayDirection 	= corners[i] - transform.position;
		var ray 			= Ray( transform.position, rayDirection );
		var status = Physics.Raycast( ray, hitinfo, rayDirection.magnitude );
		Debug.DrawLine(transform.position, corners[i]);
		//there should only be one object to collide with between the origin and the target.
		//Debug.Log("RC: Corner " + i);
		if( !status ){
			//Debug.Log("RC: Raycast failed." + ray);
			continue;
		}
		//Debug.Log("RC: Raycast succeeeded. Point:" + (hitinfo.point) + ", Norm:" + (hitinfo.normal));
		outArray[i] = hitinfo.point;
	}
	succeeded = true;
	outs = outArray;
	return outArray;
}

