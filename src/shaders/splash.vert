precision mediump float;
attribute vec3 position;
attribute vec4 instancePosition;  // x, y, z, length
attribute float instanceAngle;    // 新增角度屬性
attribute float instanceStartTime;
uniform mat4 projection, view;
uniform float timeScale;
uniform float currentTime;
uniform float planeSize;  // Add planeSize uniform
varying float vProgress;  // 添加 varying 變數
varying float vPosZ;

void main() {
  vec3 pos = position;

  // 1. 先把基準點移到底部（y = -1）
  pos.y += 1.0;

  // 2. 套用長度縮放
  pos.y *= instancePosition.w;

  // 3. 應用旋轉（現在是以底部為基準點）
  float c = cos(instanceAngle);
  float s = sin(instanceAngle);
  vec2 rotated = vec2(
    pos.x * c - pos.y * s,
    pos.x * s + pos.y * c
  );
  pos.x = rotated.x;
  pos.y = rotated.y;

  // 4. 根據時間計算移動
  float timePassed = currentTime - instanceStartTime;
  float moveProgress = timePassed / 0.1; // 0.1秒內完成移動
  moveProgress = clamp(moveProgress * mix(2., 1.0, timeScale), 0.0, 1.0);
  vProgress = 1.0 - moveProgress;  // 傳遞給 fragment shader

  // 計算移動方向（垂直於 splash 的方向）
  float moveAngle = instanceAngle + 3.14159 / 2.0; // 加上 90 度
  float moveDistance = instancePosition.w * 5.0 * (moveProgress + 0.1); // 移動距離與長度成正比
  vec2 offset = vec2(
    moveDistance * cos(moveAngle),
    moveDistance * sin(moveAngle)
  );
  pos.x += offset.x;
  pos.y += offset.y;

  // 5. 最後加上位置偏移
  pos += instancePosition.xyz;

  // 6. 計算 z 值
  vPosZ = mix(.3, 1., (pos.z + planeSize) / 2. / planeSize);

  gl_Position = projection * view * vec4(pos, 1);
}