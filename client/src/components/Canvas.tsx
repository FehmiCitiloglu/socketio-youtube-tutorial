import { useEffect, useRef } from "react";

interface Props {
  image: any;
}

const Canvas = ({ image, ...props }: Props) => {
  const canvasRef = useRef<any>();
  useEffect(() => {
    const context = canvasRef.current.getContext("2d");

    context.drawImage(image, 0, 0);
  }, [image]);

  return <canvas ref={canvasRef} {...props} />;
};
export default Canvas;
