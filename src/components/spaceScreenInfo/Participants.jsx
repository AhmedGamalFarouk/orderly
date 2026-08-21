import { useSelector } from "react-redux";
import Avatar from "../Avatar";
import { UsersIcon } from "../../assets/icons/icons";

export default function Participants() {
  const participants = useSelector((state) => state.participants);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-lg font-bold text-base-content">
            Participants
          </h3>
        </div>
        <span className="badge badge-sm badge-ghost font-semibold text-xs text-neutral">
          {participants.length} {participants.length === 1 ? "person" : "people"}
        </span>
      </div>

      {/* Participants List */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-52 pr-1">
        {participants.length === 0 ? (
          <div className="text-center py-4 px-2 bg-base-200/40 rounded-xl border border-dashed border-base-300/60">
            <p className="text-xs text-neutral">Waiting for friends to join...</p>
          </div>
        ) : (
          participants.map((participant) => {
            const itemCount = (participant.selectedItems || []).reduce(
              (sum, item) => sum + Number(item.quantity || 0),
              0
            );

            return (
              <div
                key={participant.id}
                className="flex justify-between items-center p-2 rounded-xl bg-base-200/40 hover:bg-base-200/80 transition-colors border border-base-200/50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar title={participant.name} className="w-8 h-8 text-xs font-bold" />
                  <span className="font-body text-sm font-medium text-base-content truncate max-w-[120px]">
                    {participant.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {itemCount > 0 ? (
                    <span className="text-[11px] font-semibold text-secondary px-2 py-0.5 bg-secondary/10 rounded-full">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral/60 px-2 py-0.5 bg-base-300/40 rounded-full">
                      browsing
                    </span>
                  )}
                  <span className="w-2 h-2 rounded-full bg-success inline-block shadow-xs" title="Connected" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
