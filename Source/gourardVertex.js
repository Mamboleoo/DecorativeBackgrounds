const gourardVertexShaderSrc = `        
        attribute vec4 aPosition;
        
        uniform mat4 view;
        uniform vec4 u_color;
        uniform mat4 u_worldInverseTranspose;
        uniform vec3 u_viewWorldPosition;
        uniform vec3 u_lightWorldPosition;
        attribute vec3 a_normal;  
        varying vec3 v_normal;
        uniform mat4 uModelTransformMatrix; 
        
        uniform float u_shininess;
        // uniform vec3 u_lightColor;
        uniform vec3 u_specularColor;
        
        uniform mat4 projection;
        varying vec3 v_surfaceToLight;
        varying vec3 v_surfaceToView; 
        varying vec4 color;

void main(){
        gl_Position = projection * view * uModelTransformMatrix * vec4(aPosition); 
          v_normal = mat3(u_worldInverseTranspose) * a_normal;
          vec3 surfaceWorldPosition = (uModelTransformMatrix * aPosition).xyz;
          v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
          v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
          vec3 normal = normalize(v_normal);
          vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
          vec3 surfaceToViewDirection = normalize(v_surfaceToView);
          vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
          float light = dot(normal, surfaceToLightDirection);
          float specular = 0.0;
          if (light > 0.0) {
          specular = pow(dot(normal, halfVector), u_shininess);
          }
          color = u_color;
          color.xyz *= light;
          color.xyz += specular * u_specularColor;
          gl_PointSize = 0.1;    
}

	  `;

export default gourardVertexShaderSrc;