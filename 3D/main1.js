/*    // revolutions per second
    var angularSpeed = 0.2; 
    var lastTime = 0;
    var pointCloud,render,camera,scene,sphere;

    init();
    animate();

    // this function is executed on each animation frame
    function animate(){
        // update
        var time = (new Date()).getTime();
        var timeDiff = time - lastTime;
        var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
        pointCloud.rotation.x += 0.005;
        pointCloud.rotation.y += 0.005;
        lastTime = time;

        // render
        renderer.render(scene, camera);

                // request new frame
                requestAnimationFrame(function(){
                    animate();
                });
    }

    function init(){
        // renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // camera
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 500;

        // scene
        scene = new THREE.Scene();

        // point cloud geometry
        var geometry = new THREE.SphereGeometry( 100, 32, 16 );
        
        // vertex colors
        var colors = [];
        for( var i = 0; i < geometry.vertices.length; i++ ) {
        
            // random color
            colors[i] = new THREE.Color();
            colors[i].setHSL( Math.random(), 1.0, 0.5 );

        }
        geometry.colors = colors;

        // material
        material = new THREE.PointCloudMaterial( {
            size: 10,
            transparent: true,
            opacity: 0.7,
            vertexColors: THREE.VertexColors
        } );

        // point cloud
        pointCloud = new THREE.PointCloud( geometry, material );
        scene.add( pointCloud );

        //sphere
        var color = new THREE.Color("rgb(255,255,255)");
        var meshMaterial = new THREE.MeshBasicMaterial;
        meshMaterial.color = color;
        var mats = [];
        mats.push(new THREE.MeshBasicMaterial({ color: 0x009e60  }));
        mats.push(new THREE.MeshBasicMaterial({ color: 0x0051ba  }));
        mats.push(new THREE.MeshBasicMaterial({ color: 0xffd500  }));
        mats.push(new THREE.MeshBasicMaterial({ color: 0xff5800  }));
        mats.push(new THREE.MeshBasicMaterial({ color: 0xC41E3A  }));
        mats.push(new THREE.MeshBasicMaterial({ color: 0xffffff  }));
        var faceMaterial = new THREE.MeshFaceMaterial(mats);
        sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 3, 2), faceMaterial);
        sphere.position.x = 100;
        sphere.overdraw = true;
        scene.add(sphere);

        //light
        var light = new THREE.PointLight( 0xff0000, 1, 100 );
        light.position.set( 150, 150, 150 );
        scene.add( light );

        var img1 = new Image();//document.getElementById('myImg')
        img1.src = "file:///Users/xuehanyu/Documents/webphoto.jpg";
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = img1.width;
        canvas.height = img1.height;
        context.drawImage(img1, 0, 0); 

        var group = new THREE.Group();
        var data = context.getImageData(0, 0, img1.width,img1.height).data;
        var sphereL = new THREE.Mesh(new THREE.SphereGeometry(1, 3, 2), meshMaterial);
        for(var x = 0 ; x < 200; ++x)
            for(var y = 0 ; y < 200 ; ++y)
            {   
                
                sphereL.position.x = x ;
                sphereL.position.y = y ;
                sphereL.overdraw = true;
                group.add(sphereL);
           //     scene.add(sphereL);
            }
        scene.add(group);
        console.log(canvas.width);
        console.log(canvas.height);
    }
*/



      var container, stats;

      var camera, scene, renderer;

      var mergedGeo;

      var geometry, group;

      var mouseX = 0, mouseY = 0;

      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;

      document.addEventListener( 'mousemove', onDocumentMouseMove, false );

      var urlHashJSON = {
        read  : function(){
          if( !window.location.hash ) return undefined;
          var hashStr = window.location.hash.substring(1);
          var options = JSON.parse(decodeURIComponent(hashStr));
          return options;
        },
        write : function(options){
          var hashStr = encodeURIComponent(JSON.stringify(options));
          window.location.hash  = '#'+hashStr;
        }
      }

      function mole(number1, number2){
        return number2 - parseInt(number2 / number1) * number1;
      }

      function generateCube(nCubes, doMerge, generated){
        var img1 = new Image();//document.getElementById('myImg')
        img1.src = "file:///Users/xuehanyu/Documents/water.png";
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = img1.width;
        canvas.height = img1.height;
        context.drawImage(img1, 0, 0); 
        var width = img1.width, height = img1.height;
        var data = context.getImageData(0, 0, width,height).data;

        var p1 = 0.8;
        var geometry  = new THREE.SphereGeometry(10, 3, 2);

//        document.getElementById("generationMsg").innerHTML  = (nCubes-generated)+ " cubes to generate";
        nCubes = width * height ;

        for(var l = 0 ; l < nCubes && nCubes > generated; l++){
          generated++;

          var material = new THREE.MeshNormalMaterial();
          var basicFace = new THREE.MeshBasicMaterial();
          basicFace.color.r = data[4*l]   / 255;
          basicFace.color.g = data[4*l+1] / 255;
          basicFace.color.b = data[4*l+2] / 255;
          var mesh  = new THREE.Mesh( geometry, basicFace );

          var gray =  data[4*l]*0.299 + data[4*l+1]*0.587 + data[4*l+2]*0.114;
          mesh.position.x = parseInt(l / width) * 10 - 1000;
          mesh.position.z = mole(width,l) * 10 - 1000;
          mesh.position.y = 1/Math.acos(gray/255*p1) * 1000 - 1000;
    
         if( doMerge ){
            THREE.GeometryUtils.merge(mergedGeo, mesh);
          }else{
            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();
            group.addChild( mesh ); 
          }  
        }
         if( nCubes !== generated){
          setTimeout(function(){  generateCube(nCubes, doMerge, generated); }, 0)
          
        }

        if( nCubes === generated ){
//          document.getElementById("generationMsg").innerHTML  = generated+ " cubes generated";

          if( doMerge ){
            mergedGeo.computeFaceNormals();
            group = new THREE.Mesh( mergedGeo, material );
            group.matrixAutoUpdate = false;
            group.updateMatrix();
          } 
            scene.addObject( group );         
        }
      }

      init();
      animate();
      

      function init() {

        container = document.createElement( 'div' );
        document.body.appendChild( container );

        camera = new THREE.Camera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0xffffff, 1, 10000 );

        var options = urlHashJSON.read()  || {};
        options.nCubes  = 1000; //options.nCubes !== undefined  ? options.nCubes  : 2000;
        options.doMerge = true;//options.doMerge !== undefined ? options.doMerge : false;

        var nCubes  = options.nCubes;
        var doMerge = options.doMerge;
        
        urlHashJSON.write(options)
        
        group     = new THREE.Object3D();         
        mergedGeo = new THREE.Geometry();
        setTimeout(function(){  generateCube(nCubes, doMerge, 0); }, 0)

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.sortObjects = false;
        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 100;
        container.appendChild( stats.domElement );

      }

      function onDocumentMouseMove(event) {

        mouseX = ( event.clientX - windowHalfX ) * 10;
        mouseY = ( event.clientY - windowHalfY ) * 10;

      }

      function animate() {

        requestAnimationFrame( animate );

        render();
        stats.update();

      }

      function render() {

        var rx = Math.sin( new Date().getTime() * 0.0007 ) * 0.5;
        var ry = Math.sin( new Date().getTime() * 0.0003 ) * 0.5;
        var rz = Math.sin( new Date().getTime() * 0.0002 ) * 0.5;

        camera.position.x += 150 + (   mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;

        group.rotation.x = rx;
        group.rotation.y = ry;
        group.rotation.z = rz;

        renderer.render( scene, camera );
      }































