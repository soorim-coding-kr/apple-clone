(() => {
	let yOffset = 0; // = window.pageYOffset
	let prevScrollHeight = 0; //현재 스크롤 위치(=yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
	let currentScene = 0; // 현재 활성화된(눈앞에 보이는) 스크롤 섹션

	const sceneInfo = [
		{
			// scroll-section-0
			//각 구간의 스크롤 전체 height
			type: 'sticky',
			heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
			scrollHeight: 0,
			objs: {
				container: document.querySelector('#scroll-section-0'),
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
		console.log(sceneInfo);
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

	// 몇번째 스크롤 섹션에서 애니메이션을 활성화 시킬지
	function scrollLoop() {
		prevScrollHeight = 0;
		for (let i = 0; i < currentScene; i++) {
			// prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
			// prevScrollHeight += sceneInfo[i].scrollHeight;
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}
		if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			currentScene++;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}
		if (yOffset < prevScrollHeight) {
			if (currentScene === 0) return; // 브라우저 바운스 효과로 마이너스가 되는 것을 방지
			currentScene--;
			document.body.setAttribute('id', `show-scene-${currentScene}`);
		}
		console.log(prevScrollHeight);
		console.log(currentScene);
	}

	window.addEventListener('scroll', () => {
		yOffset = window.pageYOffset;
		scrollLoop();
	});
	// window.addEventListener('DOMContentLoaded', setLayout);
	window.addEventListener('load', setLayout);
	window.addEventListener('resize', setLayout);
})();
