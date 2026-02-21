import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { DashboardStats } from "./dashboard-stats";
import { DashboardPipeline } from "./dashboard-pipeline";
import { DashboardActivity } from "./dashboard-activity";
import { DashboardInterviews } from "./dashboard-interviews";

export function FeatureManagement() {
  return (
    <section className="py-24 bg-gray-50 border-y border-border-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold text-text-main-light mb-4">
            Powerful Candidate Management
          </h2>
          <p className="text-lg text-text-muted-light max-w-2xl mx-auto">
            Visualize your hiring pipeline with our new intuitive dashboard
            designed for modern recruitment teams.
          </p>
        </div>
        <div className="bg-surface-light rounded-2xl shadow-xl overflow-hidden border border-border-light flex h-[800px] max-h-[85vh] text-left">
          <DashboardSidebar />
          <main className="flex-1 overflow-y-auto bg-background-light relative scrollbar-hide">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none z-0"></div>
            <DashboardHeader />
            <div className="p-8 relative z-0 space-y-8">
              <DashboardStats />
              <DashboardPipeline />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                <DashboardActivity />
                <DashboardInterviews />
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
