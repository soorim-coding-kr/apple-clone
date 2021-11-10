(() => {
	let yOffset = 0; // = window.pageYOffset
	let prevScrollHeight = 0; //현재 스크롤 위치(=yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0; // 현재 활성화된(눈앞에 보이는) 스크롤 섹션
	let enterNewScene = false; // 새로운 섹션이 시작되는 순간 = currentScene이 바뀌는 순간 true //섹션이 변경될 때 scrollRatio 음수가 나오지 않게 하기 위함

	const sceneInfo = [
		{
			// scroll-section-0
			//각 구간의 스크롤 전체 height
			type: 'sticky',
			heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
				messageA: document.querySelector('#scroll-section-0 .main-message.a'),
				messageB: document.querySelector('#scroll-section-0 .main-message.b'),
				messageC: document.querySelector('#scroll-section-0 .main-message.c'),
				messageD: document.querySelector('#scroll-section-0 .main-message.d'),
			},
			values: {
				messageA_opacity: [0, 1],
				messegaA_translateY: [-20, 0],
			},
		},
		{
			// scroll-section-1
			type: 'normal',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-1'),
			},
		},
		{
			// scroll-section-2
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-2'),
			},
		},
		{
			// scroll-section-3
			type: 'sticky',
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-3'),
			},
		},
	];

	function setLayout() {
		//각 스크롤 섹션의 높이 세팅
		for (let i = 0; i < sceneInfo.length; i++) {
			sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			sceneInfo[
				i
			].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
		}
		// console.log(sceneInfo);
		// setLayout에서 currentScene 세팅 (브라우저 새로고침 시에도 currentScene 맞추기 위함)
		yOffset = window.pageYOffset;
		let totalScrollHeight = 0;
		for (let i = 0; i < sceneInfo.length; i++) {
			// 각 씬의 스크롤높이값을 계속 더해줌
			totalScrollHeight += sceneInfo[i].scrollHeight;
			// 전체 스크롤 높이가 현재 스크롤 높이보다 작으면
			if (totalScrollHeight >= yOffset) {
				// 현재 씬을 currentScene으로 세팅하고 for문 멈춤
				currentScene = i;
				break;
			}
		}
		document.body.setAttribute('id', `show-scene-${currentScene}`);
	}
	// 변화의 시작,끝값 = sceneInfo 의 values
	function calcValues(values, currentYOffset) {
		let rv;
		//현재 섹션을 기준으로 현재 스크롤 위치값에 따른 비율
		let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
		rv = scrollRatio * (values[1] - values[0]) + values[0];
		return rv;
	}

	// 섹션 별 애니메이션 세팅 (보여지는 섹션에서만 구현되도록 위함)
	function playAnimation() {
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		// currentYOffset = 현재 섹션의 top 0 위치로부터 얼만큼 스크롤이 되었는지
		const currentYOffset = yOffset - prevScrollHeight;
		// console.log(currentScene, currentYOffset);
		console.log(currentScene);
		switch (currentScene) {
			case 0:
				// console.log('0 play;');
				let messageA_opacity_in = calcValues(
					values.messageA_opacity,
					currentYOffset
				);
				objs.messageA.style.opacity = messageA_opacity_in;
				console.log(messageA_opacity_in);
				// console.log(calcValues(values.messageA_opacity, currentYOffset));
				break;
			case 1:
				// console.log('1 play;');
				break;
			case 2:
				// console.log('2 play;');
				break;
			case 3:
				// console.log('3 play;');
				break;
		}
	}

	// 몇번째 스크롤 섹션에서 애니메이션을 활성화 시킬지
	function scrollLoop() {
		enterNewScene = false; // 스크롤 시 기본 false 세팅
		prevScrollHeight = 0;
		for (let i = 0; i < currentScene; i++) {
			// prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
			// prevScrollHeight += sceneInfo[i].scrollHeight;
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}
		if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true; // 씬이 변경될 때 true로 변경
			currentScene++;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}
		if (yOffset < prevScrollHeight) {
			enterNewScene = true;
			if (currentScene === 0) return; // 브라우저 바운스 효과로 마이너스가 되는 것을 방지
			currentScene--;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}
		// console.log(prevScrollHeight);
		// console.log(currentScene);

		//스크롤에 따라 값을 반영하는 함수가 playAnimation 이기 때문에 enterNewScene이 ture일때는  playAnimation을 실행하기 전에 return으로 강제종료
		if (enterNewScene) return;
		playAnimation();
	}

	window.addEventListener('scroll', () => {
		yOffset = window.pageYOffset;
		scrollLoop();
	});
	// window.addEventListener('DOMContentLoaded', setLayout);
	window.addEventListener('load', setLayout);
	window.addEventListener('resize', setLayout);
})();
