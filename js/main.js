import {GLTFLoader} from "./GLTFLoader.js";
import {OrbitControls} from "./OrbitControls.js";
import {GUI} from "./dat.gui.module.js";

//Gui
const myGui = new GUI();
const ansatzGuiFolder = myGui.addFolder("Ansätze Position")   
/* ansatzGuiFolder.open();*/
const farbeGuiFolder = myGui.addFolder("Ansätze Farbe")   
const mitteGuiFolder = myGui.addFolder("Mitte")   
const stielGuiFolder = myGui.addFolder("Stiel")   

window.onload = function (){
   
    var scene = new THREE.Scene();
    //camera
    const fov = 65;
    const near = 0.2;
    const far = 2000;
    const size =  window.innerWidth/window.innerHeight;
    var camera = new THREE.PerspectiveCamera(fov, size, near, far);
    camera.position.set(-16, 0, 51);
    
    //kantenschärfe
    var render = new THREE.WebGLRenderer({ antialias:true });
    render.setSize( window.innerWidth, window.innerHeight );
    scene.background = new THREE.Color(0xdddddd);
    render.toneMapping = THREE.ReinhardToneMapping;
    render.toneMappingExposure = 2.3;
    render.shadowMap.enabled = true;
    render.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild( render.domElement );

    //light
    const skyColor= 0xffeeb1; 
    const groundColor = 0x080820;  
    const intensity = 10.2;
    const hemiLight = new THREE.HemisphereLight( skyColor, groundColor, intensity );
    hemiLight.position.set(0,190,0);
    scene.add(hemiLight);
/*  const helper = new THREE.HemisphereLightHelper( hemiLight, 5 );
    scene.add(helper); */
    const color = 0xFFFFFF;
   
   let light1 = new THREE.PointLight(0xffffff, 3);
   light1.position.set(0,300,500)
   scene.add(light1)

   let light2 = new THREE.PointLight(0xffffff, 3);
   light2.position.set(500,100,0)
   scene.add(light2)
   /* const helper2 = new THREE.PointLightHelper( light2, 5 );
   scene.add(helper2);  */

   let light3 = new THREE.PointLight(0xffffff, 3);
   light3.position.set(0,100,-500)
   scene.add(light3)
  /*  const helper = new THREE.PointLightHelper( light3, 5 );
   scene.add(helper);  */

    let amColor = "#faffe3";
    let amLight = new THREE.AmbientLight(amColor);
    scene.add(amLight);

    var meshes = null;
    var objLoader = new GLTFLoader();
    objLoader.load('model/gltf/hammer.glb', function(object){
        object.scene.children[0].position.set(0,10,0)
        object.scene.children[0].castShadow = true; 
        object.scene.children[0].rotateY( Math.PI / 62 )
        object.scene.children[0].scale.set(0.4,0.4,0.4)
        
        meshes = object.scene.children[0];

        

        object.scene.children[0].traverse(child => {
            if (child.isMesh) {
                child.castShadow = child.receiveShadow = true;
                child.material.needsUpdate = true;
            } 
            if(child.name == 'Cube'){
              
                child.material.reflectivity=0;
                child.material.metalness = 0.9;
                child.material.roughness = 0.2;
                var data = {
                    color: child.material.color.getHex(),
                }
                ansatzGuiFolder.add( child.position , "z", 0, Math.PI * 2 + 10, 0.02)
                farbeGuiFolder.addColor( data, "color").onChange(()=>{
                    child.material.color.setHex(Number(data.color.toString().replace('#','0x')))
                })
                farbeGuiFolder.add( child.material, "metalness", 0, 1, 0.01 )
                farbeGuiFolder.add( child.material, "roughness", 0, 1, 0.01 )
               
            }
            if(child.name == 'Cube_1'){
                child.material.reflectivity=0;
                child.material.metalness = 0.9;
                child.material.roughness = 0.2;
                var data = {
                    color: child.material.color.getHex(),
                }
                ansatzGuiFolder.add( child.position , "z", 0, Math.PI * 2 + 10, 0.02)
                farbeGuiFolder.addColor( data, "color").onChange(()=>{
                    child.material.color.setHex(Number(data.color.toString().replace('#','0x')))
                })
                farbeGuiFolder.add( child.material, "metalness", 0, 1, 0.01 )
                farbeGuiFolder.add( child.material, "roughness", 0, 1, 0.01 )
               
            }  
            //Mitte
            if(child.name == 'Cube_2'){
                child.material.metalness = 1;
                child.material.roughness = 0.4;
                child.material.color.setHex("0xe9e9e9")
               
                const bumpMap = new THREE.TextureLoader().load('model/stiel_bump.jpg');
                child.material.bumpMap = bumpMap;
                child.material.bumpMapScale = 1;

                const normalMap = new THREE.TextureLoader().load('model/stiel_normal.jpg');
                child.material.normalMap = normalMap;
                child.material.normalMapScale = 1;
                child.material.normalScale.x = 0.52;
                child.material.normalScale.y = 0.08;

                var data = {
                    color: child.material.color.getHex(),
                }
                mitteGuiFolder.addColor( data, "color").onChange(()=>{
                    child.material.color.setHex(Number(data.color.toString().replace('#','0x')))
                })
                
                mitteGuiFolder.add( child.material, "metalness", 0, 1, 0.01 )
                mitteGuiFolder.add( child.material, "roughness", 0, 1, 0.01 )
                mitteGuiFolder.add( child.material, "bumpMapScale", 0, 10, 0.01 )
                mitteGuiFolder.add( child.material.normalScale, "x", 0, 5, 0.01 )
                mitteGuiFolder.add( child.material.normalScale, "y", 0, 5, 0.01 )

                console.log(child)
            }
            if(child.name == 'Cube_3'){
                child.material.metalness = 0.6;
                child.material.roughness = 0.3;
                child.castShadow = child.receiveShadow = true;
                const displacementMap = new THREE.TextureLoader().load('model/halder_bumpMap.jpg');
                child.material.displacementMap = displacementMap;
                child.material.displacementScale = 0.7;
                const normalMap = new THREE.TextureLoader().load('model/halder_normalMap.jpg');
                child.material.normalMap = normalMap;
                child.material.normalMapScale = 1;
                child.material.normalScale.x = 2.6;
                child.material.normalScale.y = 5;

                stielGuiFolder.add( child.material, "metalness", 0, 1, 0.01 )
                stielGuiFolder.add( child.material, "roughness", 0, 1, 0.01 )
                stielGuiFolder.add( child.material, "displacementScale", 0, 10, 0.01 )
                stielGuiFolder.add( child.material.normalScale, "x", 0, 5, 0.01 )
                stielGuiFolder.add( child.material.normalScale, "y", 0, 5, 0.01 )
            }
        });
      
       /*  var newMaterial = new THREE.MeshStandardMaterial({color:'red'});
        object.scene.traverse((o) => {
            if (o.isMesh) o.material = newMaterial;
        }); */
        scene.add( meshes )
        
    },
    function ( xhr ) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function ( error ) {
		console.log( 'An error happened' );
	}
    );
  

    //Achsen Helper - Muss mittig zum Objekt sein
  /*   var axisHelper = new THREE.AxisHelper(100);
    scene.add(axisHelper); */

    var controls = new OrbitControls(camera, render.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.minDistance = 30;
    controls.maxDistance = 50;
  
    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix();
        render.setSize(window.innerWidth, window.innerHeight)
    }
  

    var animate = function(){
        requestAnimationFrame(animate);
        controls.update();
        if(meshes){
            meshes.rotation.y += 0.01;
        }
       
        render.render(scene, camera);
    }
    animate();



};