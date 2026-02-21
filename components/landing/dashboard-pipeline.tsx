import Image from "next/image";
import React from "react";

export function DashboardPipeline() {
  return (
    <div className="bg-surface-light rounded-xl border border-border-light shadow-card overflow-hidden">
      <div className="px-6 py-5 border-b border-border-light flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-main-light">
            Candidate Pipeline
          </h2>
          <p className="text-sm text-text-muted-light">
            Manage active applications and their stages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button className="px-3 py-1.5 bg-white rounded-md shadow-sm text-xs font-medium text-gray-900">
              List
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Board
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-border-light rounded-lg text-sm text-text-muted-light hover:bg-gray-50 transition-colors">
            <span className="material-icons-outlined text-[18px]">
              filter_list
            </span>
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-border-light rounded-lg text-sm text-text-muted-light hover:bg-gray-50 transition-colors">
            <span className="material-icons-outlined text-[18px]">
              file_download
            </span>
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 text-text-muted-light font-medium uppercase tracking-wider text-xs border-b border-border-light">
            <tr>
              <th className="px-6 py-4 font-semibold">Candidate Name</th>
              <th className="px-6 py-4 font-semibold">Role Applied</th>
              <th className="px-6 py-4 font-semibold">Stage</th>
              <th className="px-6 py-4 font-semibold">Match Score</th>
              <th className="px-6 py-4 font-semibold">Applied Date</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light">
            {/* Candidate 1 */}
            <tr className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-bold">
                    ZL
                  </div>
                  <div>
                    <p className="font-medium text-text-main-light">
                      Zak Lambert
                    </p>
                    <p className="text-xs text-text-muted-light">
                      zak.lambert@example.com
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-text-main-light">
                Senior Product Designer
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                  Tech Interview
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-text-main-light">
                    92%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-text-muted-light">Oct 24, 2023</td>
              <td className="px-6 py-4 text-right">
                <button className="text-text-muted-light hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-icons-outlined">more_vert</span>
                </button>
              </td>
            </tr>
            {/* Candidate 2 */}
            <tr className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Image
                    alt="Sarah Chen"
                    className="h-10 w-10 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6nm8ShSpa-46i0NT8K-8S58ViAI4W-9pDoz6sYNij1QCcLuxZfHihjBLTSFcjzUspG7Xa8aORk1TC-Pok4jvf1ulPJKq1yYGQPIRQwcfiXQXIv2Kvgvd09gfnlbi1TlnAAaeLge7q2Kf1JZGcA2uiOBWmT6uVExzWYAx9DXItkNP4N2x0sFhAF32YQN7vCe0romF8H-QZyi4OAx9MFqpttwVDPDIYpTIwISJrTfv1hiySUmJZKU1_w2oGc0a6WmO_8WCwSIdzDRM"
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="font-medium text-text-main-light">
                      Sarah Chen
                    </p>
                    <p className="text-xs text-text-muted-light">
                      s.chen@design.co
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-text-main-light">
                Frontend Engineer
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                  Screening
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-yellow-500 h-1.5 rounded-full"
                      style={{ width: "78%" }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-text-main-light">
                    78%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-text-muted-light">Oct 23, 2023</td>
              <td className="px-6 py-4 text-right">
                <button className="text-text-muted-light hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-icons-outlined">more_vert</span>
                </button>
              </td>
            </tr>
            {/* Candidate 3 */}
            <tr className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-900 font-bold">
                    MJ
                  </div>
                  <div>
                    <p className="font-medium text-text-main-light">
                      Marcus Johnson
                    </p>
                    <p className="text-xs text-text-muted-light">
                      mjohnson@tech.net
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-text-main-light">
                Backend Developer
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  Offer Sent
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: "95%" }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-text-main-light">
                    95%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-text-muted-light">Oct 20, 2023</td>
              <td className="px-6 py-4 text-right">
                <button className="text-text-muted-light hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-icons-outlined">more_vert</span>
                </button>
              </td>
            </tr>
            {/* Candidate 4 */}
            <tr className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Image
                    alt="David Kim"
                    className="h-10 w-10 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfyWZLQqqrueWkLb_E3zoYeX_HXI-hqoaf5UsOQF61V9MYwb30gO9yWnx1HXv8tFv1e3rG_KPs80vib9YHB3OhrcHZUUW8wwaBRPO6g9yJijFRTyP5bOgnAHSSl_4UmgLwAuTNJl1AKvhSzJlh7txFXOBc8yWOSIMN_A8xYhphxlXjRFZwmjHrg6dU8mr1EXmGNOKuChTTrLUzVdoT7lxvL20rvYuecdTxFApoqsHeRfjGbMulLSK3nJitGLUMZkOHyuumcCX4lCc"
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="font-medium text-text-main-light">
                      David Kim
                    </p>
                    <p className="text-xs text-text-muted-light">
                      kim.david@proton.me
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-text-main-light">
                Product Manager
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  Application
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gray-400 h-1.5 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-text-main-light">
                    AI Parsing...
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-text-muted-light">Just now</td>
              <td className="px-6 py-4 text-right">
                <button className="text-text-muted-light hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-icons-outlined">more_vert</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-border-light flex items-center justify-between">
        <div className="text-sm text-text-muted-light">
          Showing <span className="font-medium text-text-main-light">1</span> to{" "}
          <span className="font-medium text-text-main-light">4</span> of{" "}
          <span className="font-medium text-text-main-light">12</span> results
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 text-sm border border-border-light rounded-md text-text-muted-light hover:bg-gray-50 disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="px-3 py-1 text-sm border border-border-light rounded-md text-text-main-light hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
