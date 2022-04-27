import confetti from "canvas-confetti";

// go Buckeyes!
const colors = ["#bb0000", "#ffffff", "#ffff00", "#bb00bb"];

export const runFireWorks = function frame() {
  const end = Date.now() + 1 * 1000;
  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 130,
      origin: { x: 0 },
      startVelocity: 60,
      disableForReducedMotion: true,
      colors: colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 130,
      startVelocity: 60,
      disableForReducedMotion: true,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};
