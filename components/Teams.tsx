"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Ensure you have a supabase client
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Team {
  id: string;
  teamName: string;
  category: string;
  teacherName: string;
  registrationStatus: string;
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teams from Supabase
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("teams")
        .select("id, teamName, category, teacherName, registrationStatus")
        .order("registrationStatus", { ascending: false });

      if (error) {
        console.error("Error fetching teams:", error);
      } else {
        setTeams(data || []);
      }
      setLoading(false);
    };

    fetchTeams();
  }, []);

  return (
    <section id="teams" className="py-12">
      <div className="container mx-auto px-4 md:w-4/5 lg:w-3/4">
        <h2 className="text-3xl font-bold mb-2">Registered Teams</h2>
        <p className="text-gray-600 mb-6">
          Registered teams can log into their dashboard. Pending teams, please wait for approval.
        </p>

        {loading ? (
          <p className="text-gray-600">Loading teams...</p>
        ) : teams.length === 0 ? (
          <p className="text-gray-600">No teams found.</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.teamName}</TableCell>
                    <TableCell>{team.category}</TableCell>
                    <TableCell>{team.teacherName}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          team.registrationStatus === "Approved"
                            ? "bg-green-100 text-green-700"
                            : team.registrationStatus === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {team.registrationStatus}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
}
