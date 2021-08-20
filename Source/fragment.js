const fragmentShaderSrc = `      
        precision mediump float;
        uniform vec4 color;   
        uniform vec4 u_color;   
        varying vec3 v_normal;
        varying vec3 v_surfaceToLight;
        varying vec3 v_surfaceToView;
        uniform float u_shininess;

        void main () {
          vec3 normal = normalize(v_normal);

          vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
          vec3 surfaceToViewDirection = normalize(v_surfaceToView);
          vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
 
          float light = dot(normal, surfaceToLightDirection);
          float specular = 0.0;
          if (light > 0.0) {
            specular = pow(dot(normal, halfVector), u_shininess);
          }


          gl_FragColor = u_color; 

          gl_FragColor.rgb *= light;
          gl_FragColor.rgb += specular;

        }                            
	  `;

export default fragmentShaderSrc;
