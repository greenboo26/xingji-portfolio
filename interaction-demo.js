'use strict';

// A visible input simulation for the portfolio, not a motion recognition system.
(() => {
  const demo = document.querySelector('[data-input-demo="2"]');
  if (!demo) return;
  const find = id => demo.querySelector('#' + id);
  const modes = [...demo.querySelectorAll('[data-input-mode]')];
  const slider = find('arm-height');
  const holdDuration = 1000;
  let mode = 'action', state = 'ready', startedAt = null, frame = 0;

  function stopHold() {
    cancelAnimationFrame(frame);
    frame = 0;
    startedAt = null;
  }
  function progress(value) {
    find('hold-progress').value = value;
    find('hold-time').textContent = (value / 1000).toFixed(1) + ' / 1.0 秒';
  }
  function pose(value) {
    const angle = Number(value) / 100 * 90;
    find('arm-left').setAttribute('transform', `rotate(${angle} 66 47)`);
    find('arm-right').setAttribute('transform', `rotate(${-angle} 94 47)`);
    const high = Number(value) >= 90;
    slider.setAttribute('aria-valuetext', high ? '双臂达到肩高' : `抬臂进度 ${value}% ，尚未到肩高`);
    find('pose-label').textContent = high ? '双臂到肩高' : Number(value) === 0 ? '双臂自然放下' : '双臂正在抬起';
    demo.classList.toggle('pose-reached', high);
  }
  function finish() {
    stopHold();
    state = 'open';
    demo.dataset.state = state;
    slider.disabled = true;
    if (mode === 'action') progress(holdDuration);
    find('demo-step').textContent = '03 / 剧情反馈';
    find('demo-title').textContent = '路障升起，角色继续前行';
    find('demo-text').textContent = mode === 'action'
      ? '模拟的双臂到达肩高并保持了 1 秒，满足触发条件。路障升起，角色通过。'
      : '按键信号直接触发开门。无需抬手或保持姿势，角色也能通过同一段道路。';
    find('trigger-state').textContent = mode === 'action' ? '保持完成 → 触发剧情' : '按键已收到 → 触发剧情';
    find('scene-state').textContent = '道路已打开';
    find('demo-next').textContent = '重新体验 ↺';
    find('demo-next').disabled = false;
  }
  function holdTick(now) {
    if (mode !== 'action' || state !== 'holding') return;
    if (startedAt === null) startedAt = now;
    const elapsed = Math.min(holdDuration, now - startedAt);
    progress(elapsed);
    if (elapsed >= holdDuration) finish();
    else frame = requestAnimationFrame(holdTick);
  }
  function inputPose() {
    if (mode !== 'action' || state === 'open' || state === 'skipped') return;
    pose(slider.value);
    if (Number(slider.value) >= 90) {
      if (state === 'holding') return;
      state = 'holding';
      demo.dataset.state = state;
      find('demo-step').textContent = '02 / 等待触发';
      find('demo-title').textContent = '保持肩高，让路障升起';
      find('demo-text').textContent = '模拟双臂已到肩高。停留 1 秒触发剧情；将滑块往回拖，计时就会清零。';
      find('trigger-state').textContent = '达到肩高 · 正在保持';
      frame = requestAnimationFrame(holdTick);
    } else {
      const interrupted = state === 'holding';
      stopHold();
      progress(0);
      state = 'ready';
      demo.dataset.state = state;
      find('demo-step').textContent = '01 / 动作准备';
      find('demo-title').textContent = '抬起双臂，让路障升起';
      find('demo-text').textContent = '把下方滑块拖到右端，模拟双臂抬到肩高；停留 1 秒后，道路才会打开。';
      find('trigger-state').textContent = interrupted ? '提前放下 · 计时已清零' : '未到肩高 · 不触发剧情';
    }
  }
  function reset(nextMode = mode) {
    stopHold();
    mode = nextMode;
    state = 'ready';
    demo.dataset.mode = mode;
    demo.dataset.state = state;
    slider.disabled = false;
    slider.value = '0';
    pose(0);
    progress(0);
    modes.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.inputMode === mode)));
    find('action-controls').hidden = mode !== 'action';
    find('button-controls').hidden = mode !== 'button';
    find('demo-mode-label').textContent = mode === 'action' ? '动作方案 / 姿势与保持' : '按键方案 / 一次触发';
    find('demo-step').textContent = mode === 'action' ? '01 / 动作准备' : '01 / 等待按键';
    find('demo-title').textContent = mode === 'action' ? '抬起双臂，让路障升起' : '按一下，让路障升起';
    find('demo-text').textContent = mode === 'action'
      ? '把下方滑块拖到右端，模拟双臂抬到肩高；停留 1 秒后，道路才会打开。'
      : '点击“按键开路”，或在此演示中按空格。一个按键信号直接打开路障，不需要身体动作。';
    find('trigger-state').textContent = mode === 'action' ? '未到肩高 · 不触发剧情' : '等待一次按键';
    find('scene-state').textContent = '路障挡住去路';
    find('demo-next').textContent = mode === 'action' ? '先拖动上方滑块' : '按键开路 →';
    find('demo-next').disabled = mode === 'action';
  }
  modes.forEach(button => button.addEventListener('click', () => reset(button.dataset.inputMode)));
  slider.addEventListener('input', inputPose);
  find('demo-next').addEventListener('click', () => {
    if (state === 'open' || state === 'skipped') reset();
    else if (mode === 'button') finish();
  });
  find('demo-skip').addEventListener('click', () => {
    stopHold();
    state = 'skipped';
    demo.dataset.state = state;
    slider.disabled = true;
    progress(0);
    find('demo-step').textContent = '已跳过';
    find('demo-title').textContent = '这次不参与，结束体验';
    find('demo-text').textContent = '没有执行动作，也没有发送开路按键。演示停止，不记为完成任务。';
    find('trigger-state').textContent = '已跳过 · 未触发剧情';
    find('scene-state').textContent = '体验已结束';
    find('demo-next').textContent = '重新体验 ↺';
    find('demo-next').disabled = false;
  });
  demo.addEventListener('keydown', event => {
    // Native controls keep their own keyboard behavior, especially the range slider.
    if (event.code !== 'Space' || event.repeat || event.target.closest('button,input,a')) return;
    if (mode === 'button' && state === 'ready') {
      event.preventDefault();
      finish();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state === 'holding') {
      slider.value = '0';
      inputPose();
    }
  });
  reset();
})();
