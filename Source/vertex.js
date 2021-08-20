const vertexShaderSrc = `      
        attribute vec4 aPosition;  
        uniform mat4 uModelTransformMatrix;
        uniform mat4 projection;
        uniform mat4 view;
        attribute vec3 a_normal;
        varying vec3 v_normal;
        // uniform mat4 u_world;
        uniform mat4 u_worldInverseTranspose;
        uniform vec3 u_viewWorldPosition;
        varying vec3 v_surfaceToView;
        uniform vec3 u_lightWorldPosition;
        varying vec3 v_surfaceToLight;
        // uniform vec3 LightPositions[3] = {glm::vec3( 0.7f,  0.2f,  2.0f),
        //   glm::vec3( 2.3f, -3.3f, -4.0f),
        //   glm::vec3(-4.0f,  2.0f, -12.0f)};

        void main () {             
          gl_Position = projection * view * uModelTransformMatrix * vec4(aPosition); 
          gl_PointSize = 5.0;     
          v_normal = mat3(u_worldInverseTranspose) * a_normal;
          vec3 surfaceWorldPosition = (uModelTransformMatrix * aPosition).xyz;
          // for(int i = 0 ; i < 3; i++){
          //   v_surfaceToLight = LightPositions[i] - surfaceWorldPosition;
          // }
          v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
          v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
        }                          
	  `;

export default vertexShaderSrc;