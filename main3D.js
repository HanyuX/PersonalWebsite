      var container, stats;

      var camera, scene, renderer;

      var mergedGeo;

      var geometry, group;

      var mouseX = 0, mouseY = 0;

      var value1,value2;

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
        img1.src = value1;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = img1.width;
        canvas.height = img1.height;
        context.drawImage(img1, 0, 0); 
        var width = img1.width, height = img1.height;
        var data = context.getImageData(0, 0, width,height).data;

        var p1 = 0.8;
        var geometry  = new THREE.SphereGeometry(13, 3, 2);

        nCubes = width * height ;

        for(var l = 0 ; l < nCubes && nCubes > generated; l++){
          generated++;

          var material = new THREE.MeshBasicMaterial({ color: 0x5050b0  });
          var basicFace = new THREE.MeshBasicMaterial();
          basicFace.color.r = data[4*l]   / 255;
          basicFace.color.g = data[4*l+1] / 255;
          basicFace.color.b = data[4*l+2] / 255;
          var mesh  = new THREE.Mesh( geometry, basicFace );

          var gray =  data[4*l]*0.299 + data[4*l+1]*0.587 + data[4*l+2]*0.114;
          mesh.position.x = parseInt(l / width) * 10 - 1000;
          mesh.position.z = mole(width,l) * 10 - 1000;
          mesh.position.y = 1/Math.acos(gray/255*p1) * 200 - 1000;
    
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

        var str = location.href.toString().toLowerCase();
        var arrtmp = str.split("&");
        var num = arrtmp[0].indexOf("=");
        value1 = arrtmp[0].substr(num + 1);
        num = arrtmp[1].indexOf("=");
        value2 = arrtmp[1].substr(num + 1);

        camera = new THREE.Camera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 4000;
        camera.position.y = 2500;
        camera.position.x = 1500;

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0xffffff, 2500, 10000 );

        var options = urlHashJSON.read()  || {};
        options.nCubes  = 1000; //options.nCubes !== undefined  ? options.nCubes  : 2000;
        if(value2 == "false")
          options.doMerge = false;//options.doMerge !== undefined ? options.doMerge : false;
        else
          options.doMerge = true;

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


























