import { ShipmentStatus } from "@prisma/client";

export function ShipmentStatusIndicator({ status }: { status: ShipmentStatus }) {
    const statusComponents = {
        [ShipmentStatus.PENDING]: (
            <div className="px-2 py-1 bg-yellow-400 text-yellow-900 ">Pending</div>
        ),
        [ShipmentStatus.PICKED]: (
            <div className="px-2 py-1 bg-blue-400/30 text-blue-900">Picked</div>
        ),
        [ShipmentStatus.IN_TRANSIT]: (
            <div className="px-2 py-1 bg-purple-400/30 text-purple-900">In Transit</div>
        ),
        [ShipmentStatus.DELIVERED]: (
            <div className="px-2 py-1 bg-green-400/30 text-green-900">Delivered</div>
        ),
        [ShipmentStatus.RETURNED]: (
            <div className="px-2 py-1 bg-orange-400/30 text-orange-900">Returned</div>
        ),
        [ShipmentStatus.CANCELLED]: (
            <div className="px-2 py-1 bg-red-400/30 text-red-900">Cancelled</div>
        ),
        [ShipmentStatus.FAILED]: (
            <div className="px-2 py-1 bg-gray-400/30 text-gray-900">Failed</div>
        ),
    };

    return <div className="text-xs [&>div]:rounded-md">{statusComponents[status]}</div>;
}
