// ExampleComponent.jsx
import { Scrollbars } from 'react-custom-scrollbars-2';

const CustomScrollComponent = () => {
    return (
        <Scrollbars
            style={{ width: 500, height: 300 }}
            renderThumbVertical={() => <div className="thumb-vertical" />}
            renderTrackVertical={() => <div className="track-vertical" />}
        >
        </Scrollbars>
    );
};

export default CustomScrollComponent;