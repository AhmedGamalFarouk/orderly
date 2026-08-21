import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

// Components
import Button from "../components/Button";
import Container from "../components/Container";
import RecentOrder from "../components/RecentOrder";
import { fetchAdminSpaces } from "../features/slices/spaceReducer";
import { SparklesIcon, UsersIcon } from "../assets/icons/icons";

export default function Landing() {
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);
  const { spaces: spaceList, status, error } = useSelector((state) => state.space);
  const dispatch = useDispatch();

  useEffect(() => {
    if (admin.id) {
      dispatch(fetchAdminSpaces(admin.id));
    }
  }, [admin.id, dispatch]);

  function formatDate(dateString) {
    const date =
      typeof dateString?.toDate === "function"
        ? dateString.toDate()
        : new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Recent";
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const activeSpaces = spaceList.filter((s) => s.status !== "finalized" && !s.finalizedOrder);
  const finalizedSpaces = spaceList.filter((s) => s.status === "finalized" || s.finalizedOrder);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-100 py-8">
      <Container>
        {/* Dashboard Header & Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-base-200 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-2">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Host Dashboard</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-base-content tracking-tight">
              Your Ordering Spaces
            </h1>
            <p className="font-body text-sm text-neutral mt-1 max-w-lg">
              Manage live food orders with teammates, track realtime participant picks, and finalize consolidated orders.
            </p>
          </div>

          <Button
            variant="primary"
            className="py-3.5 px-6 text-sm font-bold rounded-xl shadow-xs shrink-0 self-start md:self-auto"
            onClick={() => navigate("/create-space")}
          >
            + Create New Space
          </Button>
        </div>

        {/* Status / Errors */}
        {status === "loading" && (
          <div className="text-center py-16">
            <span className="loading loading-spinner text-primary loading-lg"></span>
            <p className="font-body text-sm text-neutral mt-3">Loading your spaces...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="p-6 bg-error/10 border border-error/20 rounded-2xl text-center max-w-md mx-auto my-8">
            <p role="alert" className="text-error text-sm font-medium">
              {error || "Could not load your spaces."}
            </p>
          </div>
        )}

        {status !== "loading" && status !== "failed" && (
          <>
            {spaceList.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-base-300 max-w-xl mx-auto my-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-8 h-8" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-base-content mb-2">
                  No ordering spaces yet
                </h2>
                <p className="font-body text-sm text-neutral mb-6 max-w-md mx-auto">
                  Create a space for lunch, pizza night, or coffee runs. Share the link and watch everyone's order update in real-time.
                </p>
                <Button
                  variant="primary"
                  className="py-3 px-6 rounded-xl text-sm font-semibold"
                  onClick={() => navigate("/create-space")}
                >
                  Create Your First Space
                </Button>
              </div>
            ) : (
              /* Spaces Grid */
              <div className="space-y-8">
                {activeSpaces.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
                      <h2 className="font-heading text-xl font-bold text-base-content">
                        Active Rooms ({activeSpaces.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {activeSpaces.map((space) => (
                        <RecentOrder
                          key={space.id}
                          id={space.id}
                          spaceName={space.spaceName}
                          restaurantName={space.restaurantName}
                          date={formatDate(space.createdAt)}
                          total={space.total ?? 0}
                          status={space.status || "active"}
                          hasFinalizedOrder={Boolean(space.finalizedOrder)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {finalizedSpaces.length > 0 && (
                  <section>
                    <h2 className="font-heading text-xl font-bold text-base-content mb-4">
                      Past & Finalized Orders ({finalizedSpaces.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {finalizedSpaces.map((space) => (
                        <RecentOrder
                          key={space.id}
                          id={space.id}
                          spaceName={space.spaceName}
                          restaurantName={space.restaurantName}
                          date={formatDate(space.createdAt)}
                          total={space.total ?? 0}
                          status={space.status || "finalized"}
                          hasFinalizedOrder={Boolean(space.finalizedOrder)}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
