import React from "react";

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-surface-light p-6 rounded-xl border border-border-light shadow-card hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-text-muted-light">
              Total Candidates
            </p>
            <h3 className="text-3xl font-bold text-text-main-light mt-2">
              1,284
            </h3>
            <div className="flex items-center mt-2 text-green-600 text-sm font-medium">
              <span className="material-icons-outlined text-[16px] mr-1">
                trending_up
              </span>
              <span>+12%</span>
              <span className="text-text-muted-light ml-1 font-normal">
                vs last month
              </span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <span className="material-icons-outlined text-blue-600">
              groups
            </span>
          </div>
        </div>
      </div>
      <div className="bg-surface-light p-6 rounded-xl border border-border-light shadow-card hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-text-muted-light">
              Interviews Today
            </p>
            <h3 className="text-3xl font-bold text-text-main-light mt-2">8</h3>
            <div className="flex items-center mt-2 text-text-muted-light text-sm">
              <span className="material-icons-outlined text-[16px] mr-1 text-orange-500">
                schedule
              </span>
              <span>Next in 30 mins</span>
            </div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <span className="material-icons-outlined text-orange-600">
              event_available
            </span>
          </div>
        </div>
      </div>
      <div className="bg-surface-light p-6 rounded-xl border border-border-light shadow-card hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-text-muted-light">
              Hiring Velocity
            </p>
            <h3 className="text-3xl font-bold text-text-main-light mt-2">
              14{" "}
              <span className="text-lg font-normal text-text-muted-light">
                days
              </span>
            </h3>
            <div className="flex items-center mt-2 text-green-600 text-sm font-medium">
              <span className="material-icons-outlined text-[16px] mr-1">
                arrow_downward
              </span>
              <span>2.5 days</span>
              <span className="text-text-muted-light ml-1 font-normal">
                avg. time to hire
              </span>
            </div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <span className="material-icons-outlined text-purple-600">
              speed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
