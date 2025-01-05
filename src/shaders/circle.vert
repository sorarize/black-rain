precision mediump float;
attribute vec2 position;
attribute vec3 instancePosition;
attribute float instanceStartTime;  // 圓形的開始時間
attribute float instanceMaxRadius;  // 圓形的最大半徑
attribute float isOuter;           // 新增：用來標識是否為外圈頂點

uniform float currentTime;         // 當前時間
uniform float rainSpeed;
uniform float planeSize;
uniform float thickness;  // 基礎厚度
uniform mat4 projection, view;

varying float vProgress;  // 傳遞給 fragment shader
varying vec3 vPosition;  // 傳遞世界座標到 fragment shader
varying float vDiscard;

const float ANIMATION_DURATION = 1.2;  // 動畫持續時間（秒）

void main() {
  float deltaTime = currentTime - instanceStartTime;
  float duration = max(1.5, ANIMATION_DURATION / (rainSpeed * 15.));
  float progress = clamp(deltaTime / duration, 0., 1.0);

  // 計算基礎位置和方向
  vec2 dir = normalize(position);
  vec2 pos = dir * progress * instanceMaxRadius;  // 基礎圓的位置

  // 計算厚度（從粗到細）
  float thickOffset = thickness * (1.0 - progress);  // 絕對厚度

  // 如果是外圈頂點，沿著法向量方向偏移
  if(isOuter > 0.5) {
    pos += dir * thickOffset;  // 直接加上厚度，不受半徑影響
  }

  // 轉換到世界空間
  vec3 finalPosition = vec3(
    pos.x + instancePosition.x,
    instancePosition.y,
    pos.y + instancePosition.z
  );

  vProgress = progress;
  vPosition = finalPosition;
  vDiscard = (progress < .001) ? 1. : 0.;
  gl_Position = projection * view * vec4(finalPosition, 1);
}
