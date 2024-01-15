import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

function CustomNode({ data }) {

    var Handlers = []


    data["basic_handlers"]?.forEach(handle => {
        Handlers.push({ id: handle.handleID, type: handle.type, position: handle.type === 'source' ? Position.Right : Position.Left , offset: handle.offset })

    });

    const interval = 200 / (data["transfer_handlers"].length + 2);


    data["transfer_handlers"]?.forEach((handle, index) => {

        Handlers.push({ id: handle.handleID, type: handle.type, position: handle.position === 'top' ? Position.Top : Position.Bottom, style: { left: handle.offset * interval + interval } })

    });


    return (
        <div>
            {Handlers.map((handle) => (

                <Handle key={handle.id} type={handle.type} position={handle.position} id={handle.id} style={handle.style} />

            ))}

            <div>
                {data.label}
            </div>

        </div>
    );
}

export default CustomNode;