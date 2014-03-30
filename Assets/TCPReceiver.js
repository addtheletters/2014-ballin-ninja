#pragma strict

import System;
import System.Threading;
import System.Net;
import System.Net.Sockets;
import System.Collections;
import System.Text;


var pivot : GameObject;
var gimb : GimbalAndPosition;
//var doubleparams : double[];
var rec : TCPReceiver_c;


function Start(){
	
	gimb = pivot.GetComponent("GimbalAndPosition");
	
	rec = new TCPReceiver_c( pivot );
	
	rec.doubleparams = new double[3];
	rec.doubleparams[0] = 0;
	rec.doubleparams[1] = 0;
	rec.doubleparams[2] = 10; 
	
	rec.Start();
	
}

function Update () {

	gimb.Reposition(rec.doubleparams[0], rec.doubleparams[1], rec.doubleparams[2]);
}

class TCPReceiver_c 
{
    private var WorkerThread : Thread;
    private var running = false;
    
    private var gimbal : GimbalAndPosition;
    var doubleparams : double[];
 
    function TCPReceiver_c( piv : GameObject)
    {
	    gimbal = piv.GetComponent("GimbalAndPosition");
    }
 
    function Start(){
        Loom.RunAsync(function() {
        	Debug.Log("starting threadlistener");
    
       		var client = new TcpClient();
        	var ns : NetworkStream;
        	var port = 1337;
 	
        	try{
           	 	client.Connect(IPEndPoint(IPAddress.Parse("127.0.0.1"), port));
            	ns = client.GetStream();
            	var data = new byte[8 * 3]; // Could be whatever length you require
 
           
            	while (!ns.DataAvailable)
            	{
               	 	Thread.Sleep(10);
            	}
 
       
 
            	running = true;
  
 
            	while (running)
            	{
                
                	if (ns.DataAvailable) {
              			ns.Read(data, 0, data.Length);
                		var goesin : String = Encoding.ASCII.GetString(data,0,data.Length);
                		Debug.Log(goesin);
                		var params : String[] = goesin.Split(" "[0]);
                		
                		//doubleparams = [ double.Parse(params[0]), double.Parse(params[1]), double.Parse(params[2])  ];
                		Loom.QueueOnMainThread( function() {
		        	        	doubleparams = [ double.Parse(params[0]), double.Parse(params[1]), double.Parse(params[2])  ];
                		});
					}
                	
                   	data = new byte[8 * 3];
        		}
        	}
       	catch (InvOpEx : InvalidOperationException)
        {
            Debug.LogError("TCP exception: " + InvOpEx.Message);
        }
        catch (SockEx : SocketException)
        {
            Debug.LogError("Socket exception: " + SockEx.Message);
        }
        finally
        {
            if(ns != null)
                ns.Close();
            client.Close();
        }
        });
    }
 
    function Stop(){
        running = false;
        //WorkerThread.Join();
        //WorkerThread = null;
    }
 
    private function ThreadListener(){
    	Debug.Log("starting threadlistener");
    
        var client = new TcpClient();
        var ns : NetworkStream;
        var port = 1337;
 	
        try{
            client.Connect(IPEndPoint(IPAddress.Parse("127.0.0.1"), port));
            ns = client.GetStream();
 
            // Example of how to read data from the client...
            var data = new byte[8 * 3]; // Could be whatever length you require
 
            // Wait for the data to arrive, sleep thread continuously until it does
            // But don't wait forever, or thread might deadlock
            var waitCounter = 0;
            while (!ns.DataAvailable && waitCounter < 1000)
            {
                Thread.Sleep(10);
                waitCounter++;
            }
 
            // Done waiting. Did we exit because data is available, or did we exit because of a timeout?
            if (waitCounter == 1000)
            {
                // 10053 is the Windows Socket error code for when software causes a connection abort, possibly due to a time-out, which is exactly
                // what has happened if the waitCounter reaches 1000
                throw SocketException(10053);
            }
 
            running = true;
            // Incoming complete. Enter read loop.
 
            while (running)
            {
                // Read data chunk
                if (ns.DataAvailable) {
                	ns.Read(data, 0, data.Length);
                // Then parse v alues out of your data chunk typically using static methods 
                /**************var numbers : double[] = new double[3];
                numbers[0]	= BitConverter.ToDouble(data, 0);
                numbers[1]	= BitConverter.ToDouble(data, 8);
                numbers[2]	= BitConverter.ToDouble(data, 16);
                Debug.Log(numbers[0]);
                ************************/
                	var goesin : String = Encoding.ASCII.GetString(data,0,data.Length);
                	Debug.Log("1");
                	var params : String[] = goesin.Split(" "[0]);
                	Debug.Log("2");
                	
                	//doubleparams = [ double.Parse(params[0]), double.Parse(params[1]), double.Parse(params[2])  ];
                	Debug.Log("3");
                	Loom.QueueOnMainThread( function() {
		                	doubleparams = [ double.Parse(params[0]), double.Parse(params[1]), double.Parse(params[2])  ];
                	});
				}
                //SEND THIS TO THE MAIN QUEUE
                
            	//gimbal.Reposition(doubleparams[0], doubleparams[1], doubleparams[2]);
        		
               
                
                
                data = new byte[8 * 3];
                //Debug.Log(System.Convert.ToChar(data[0]));
            	//var gimbal 	: GimbalAndPosition	= pivot.GetComponent("GimbalAndPosition");
            	
            }
        }
        catch (InvOpEx : InvalidOperationException)
        {
            Debug.LogError("TCP exception: " + InvOpEx.Message);
        }
        catch (SockEx : SocketException)
        {
            Debug.LogError("Socket exception: " + SockEx.Message);
        }
        finally
        {
            if(ns != null)
                ns.Close();
            client.Close();
        }
    }
}