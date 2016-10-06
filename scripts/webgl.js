function drawboard(a,s)
{
    this.gl=0;
    this.fshader=0;
    this.vshader=0;
    this.program=0;
    this.rf=1;
    this.vertices=[];
    this.colors=[];
    this.player=0;
    this.rf=s;
    var c = document.getElementById(a);
    this.gl = c.getContext('webgl') || c.getContext("experimental-webgl");
    this.fshader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(this.fshader, 'varying mediump vec4 forward_color;void main(void) {gl_FragColor = forward_color;}');
    this.gl.compileShader(this.fshader);
    this.vshader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(this.vshader, 'attribute vec3 ppos; attribute vec4 pcolor; varying mediump vec4 forward_color; void main(void) { gl_Position = vec4(ppos.x, ppos.y, ppos.z, 1.0);gl_PointSize=1.0; forward_color = pcolor;}');
    this.gl.compileShader(this.vshader);
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, this.fshader);
    this.gl.attachShader(this.program, this.vshader);
    this.gl.linkProgram(this.program);
    this.gl.validateProgram(this.program);
    this.gl.useProgram(this.program);
    this.gl.enable(this.gl.DEPTH_TEST);

    this.perspect=function(f)
    {
        for (i=0;i<this.vertices.length/3;i++)
        {
            var x=this.vertices[i*3+0];
            var y=this.vertices[i*3+1];
            var z=this.vertices[i*3+2];
            var sf=Math.pow(f,z);
            x*=sf;
            y*=sf;
            this.vertices[i*3+0]=x;
            this.vertices[i*3+1]=y;
        }
    };
	this.perspect2=function(f)
    {
		f/=this.rf;
		f*=-1;
		var x,y,z;
		for (i=0;i<this.vertices.length/3;i++)
        {
		    x=this.vertices[i*3+0];
            y=this.vertices[i*3+1];
            z=this.vertices[i*3+2];
			    d = z-f;
				e=-f;
				x=e*x/d;
				y=e*y/d;
			this.vertices[i*3+0]=x;
			this.vertices[i*3+1]=y;
        }
    };
    this.rotateX=function(angle)
    {
        sin=Math.sin(angle/180*Math.PI);
        cos=Math.cos(angle/180*Math.PI);
        for (i=0;i<this.vertices.length/3;i++)
        {
            var y=this.vertices[i*3+1];
            var z=this.vertices[i*3+2];
            this.vertices[i*3+1]=y*cos-sin*z;
            this.vertices[i*3+2]=y*sin+cos*z;
        }
    };
    this.rotateY=function(angle)
    {
        sin=Math.sin(angle/180*Math.PI);
        cos=Math.cos(angle/180*Math.PI);
        for (i=0;i<this.vertices.length/3;i++)
        {
            var x=this.vertices[i*3+0];
            var z=this.vertices[i*3+2];
            this.vertices[i*3+0]=x*cos-sin*z;
            this.vertices[i*3+2]=x*sin+cos*z;
        }
    };
    this.rotateZ=function(angle)
    {
        sin=Math.sin(angle/180*Math.PI);
        cos=Math.cos(angle/180*Math.PI);
        for (i=0;i<this.vertices.length/3;i++)
        {
            var x=this.vertices[i*3+0];
            var y=this.vertices[i*3+1];
            this.vertices[i*3+0]=x*cos-sin*y;
            this.vertices[i*3+1]=x*sin+cos*y;

        }
    };
    this.scale=function(factor){
        for (i=0;i<this.vertices.length/3;i++)
        {
            this.vertices[i*3+0]*=factor;
            this.vertices[i*3+1]*=factor;
            this.vertices[i*3+2]*=factor;
        }
    };

    this.render=function()
    {
        var verts=new Float32Array(this.vertices);
        var co=new Float32Array(this.colors);
        var vattrib = this.gl.getAttribLocation(this.program, 'ppos');
        this.gl.enableVertexAttribArray(vattrib);

        var vbuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbuffer);

        this.gl.bufferData(this.gl.ARRAY_BUFFER, verts, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(vattrib, 3, this.gl.FLOAT, false, 0, 0);

        var cattrib = this.gl.getAttribLocation(this.program, 'pcolor');
        this.gl.enableVertexAttribArray(cattrib);

        var cbuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, cbuffer);

        this.gl.bufferData(this.gl.ARRAY_BUFFER, co, this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(cattrib, 4, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, verts.length/3);
        this.gl.flush();
        this.vertices=[];
        this.colors=[];

    };
    this.pushplane=function(x1,y1,z1,x2,y2,z2,x3,y3,z3,r,g,b,a)
    {
        this.vertices.push(x1/this.rf);
        this.vertices.push(y1/this.rf);
        this.vertices.push(z1/this.rf);
        this.colors.push(r);
        this.colors.push(g);
        this.colors.push(b);
        this.colors.push(a);
        this.vertices.push(x2/this.rf);
        this.vertices.push(y2/this.rf);
        this.vertices.push(z2/this.rf);
        this.colors.push(r);
        this.colors.push(g);
        this.colors.push(b);
        this.colors.push(a);
        this.vertices.push(x3/this.rf);
        this.vertices.push(y3/this.rf);
        this.vertices.push(z3/this.rf);
        this.colors.push(r);
        this.colors.push(g);
        this.colors.push(b);
        this.colors.push(a);
    };
    this.repeat=function(k,fps)
    {
        clearInterval(this.player);
        this.player=setInterval(function() {k();},1000/fps);
    };

    this.setvertices=function(a)
    {
        this.vertices=a;
    };
    this.setcolors=function(a)
    {
        this.colors=a;
    };

    this.pushmesh=function(k)
    {
        var i;
        for (i=0;i<k.vertices.length;i++)
            this.vertices.push(k.vertices[i]/this.rf);
        for (i=0;i<k.colors.length;i++)
            this.colors.push(k.colors[i]);
    };
    this.translate=function(x,y,z)
    {
        var i;
        for (i=0;i<this.vertices.length/3;i++)
        {
            this.vertices[i*3+0]+=x/this.rf;
            this.vertices[i*3+1]+=y/this.rf;
            this.vertices[i*3+2]+=z/this.rf;
        }
    };
    this.pushat=function(k,x,y,z){
        var t=new mesh();
        t.vertices=k.vertices.slice(0);
        t.colors=k.colors.slice(0);
        t.translate(x,y,z);
        this.pushmesh(t);
    };
}
function mesh(s)
{
    this.vertices=[];
    this.colors=[];

    this.pushplane=function(x1,y1,z1,x2,y2,z2,x3,y3,z3,r,g,b,a)
    {
        this.vertices.push(x1);
        this.vertices.push(y1);
        this.vertices.push(z1);
        this.colors.push(r);
        this.colors.push(g);
        this.colors.push(b);
        this.colors.push(a);
        this.vertices.push(x2);
        this.vertices.push(y2);
        this.vertices.push(z2);
        this.colors.push(r);
        this.colors.push(g);
        this.colors.push(b);
        this.colors.push(a);
        this.vertices.push(x3);
        this.vertices.push(y3);
        this.vertices.push(z3);
        this.colors.push(r);
        this.colors.push(g);
        this.colors.push(b);
        this.colors.push(a);
    };
    this.rotateX=function(angle)
    {
        sin=Math.sin(angle/180*Math.PI);
        cos=Math.cos(angle/180*Math.PI);
        for (i=0;i<this.vertices.length/3;i++)
        {
            var y=this.vertices[i*3+1];
            var z=this.vertices[i*3+2];
            this.vertices[i*3+1]=y*cos-sin*z;
            this.vertices[i*3+2]=y*sin+cos*z;
        }
    };
    this.rotateY=function(angle)
    {
        sin=Math.sin(angle/180*Math.PI);
        cos=Math.cos(angle/180*Math.PI);
        for (i=0;i<this.vertices.length/3;i++)
        {
            var x=this.vertices[i*3+0];
            var z=this.vertices[i*3+2];
            this.vertices[i*3+0]=x*cos-sin*z;
            this.vertices[i*3+2]=x*sin+cos*z;
        }
    };
    this.rotateZ=function(angle)
    {
        sin=Math.sin(angle/180*Math.PI);
        cos=Math.cos(angle/180*Math.PI);
        for (i=0;i<this.vertices.length/3;i++)
        {
            var x=this.vertices[i*3+0];
            var y=this.vertices[i*3+1];
            this.vertices[i*3+0]=x*cos-sin*y;
            this.vertices[i*3+1]=x*sin+cos*y;

        }
    };
    this.scale=function(factor){
        for (i=0;i<this.vertices.length/3;i++)
        {
            this.vertices[i*3+0]*=factor;
            this.vertices[i*3+1]*=factor;
            this.vertices[i*3+2]*=factor;
        }
    };
    this.emptymesh=function()
    {
        this.vertices=[];
        this.colors=[];
    };
    this.translate=function(x,y,z)
    {
        var i;
        for (i=0;i<this.vertices.length/3;i++)
        {
            this.vertices[i*3+0]+=x;
            this.vertices[i*3+1]+=y;
            this.vertices[i*3+2]+=z;
        }
    };
    this.pushmesh=function(k)
    {
 /*       var i;
        for (i=0;i<k.vertices.length;i++)
            this.vertices.push(k.vertices[i]);
        for (i=0;i<k.colors.length;i++)
            this.colors.push(k.colors[i]);
   */
        this.vertices.push.apply(this.vertices,k.vertices);
        this.colors.push.apply(this.colors,k.colors);
    };
    this.pushat=function(k,x,y,z){
        var t=new mesh();
        t.vertices=k.vertices.slice(0);
        t.colors=k.colors.slice(0);
        t.translate(x,y,z);
        this.pushmesh(t);
    };
    this.lighten=function(a1,a2,a3){

        amag=Math.sqrt(a1*a1+a2*a2+a3*a3);
        a1/=amag;
        a2/=amag;
        a3/=amag;
        for (i=0;i<this.vertices.length/18;i++){

            b1=this.vertices[i*18];
            b2=this.vertices[i*18+1];
            b3=this.vertices[i*18+2];

            c1=this.vertices[i*18+6];
            c2=this.vertices[i*18+7];
            c3=this.vertices[i*18+8];

            t1=b2*c3-c2*b3;
            t2=b3*c1-c3*b1;
            t3=b1*c2-b2*c1;

            tmag=Math.sqrt(t1*t1+t2*t2+t3*t3);
            t1/=tmag;
            t2/=tmag;
            t3/=tmag;

            intensity=t1*a1+t2*a2+t3*a3;
            if(intensity<=0)
                intensity=0;
            intensity+=0.6;
            for(k=0;k<6;k++)
                for(j=0;j<3;j++)
                    this.colors[i*24+4*k+j]*=intensity;
        }
    };

}
