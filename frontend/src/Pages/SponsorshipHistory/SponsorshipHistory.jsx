import { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronDown, ChevronUp, RotateCw, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/Loader";
import AuthVerify from "@/helper/jwtVerify";

export default function SponsorshipHistory() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [studentsData, setStudentsData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    if (!AuthVerify()) {
      navigate("/login", { replace: true });
    }
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(
        "/api/allotment/sessions",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const availableSessions = res.data.sessions || [];

      setSessions(availableSessions);

      if (availableSessions.length > 0) {
        setSelectedSession(availableSessions[0]);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(
        "Error fetching sessions:",
        err.response?.data || err.message
      );
      setLoading(false);
    }
  };

  const fetchSessionData = async () => {
    try {
      const res = await axios.get(
        `/api/allotment/session/${selectedSession}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setStudentsData(res.data.students || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error(
        "Error fetching sponsorship history:",
        err.response?.data || err.message
      );
      setStudentsData([]);
      setStats({
        totalStudents: 0,
        totalSponsors: 0,
      });
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!selectedSession) return;

    const loadData = async () => {
      setLoading(true);
      await fetchSessionData();
      setLoading(false);
    };

    loadData();
  }, [selectedSession]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchSessionData();
    setIsRefreshing(false);
  };

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const filteredStudents = studentsData.filter((student) => {
    const q = query.toLowerCase().trim();

    if (!q) return true;

    return (
      student.studentName?.toLowerCase().includes(q) ||
      student.rollNumber?.toLowerCase().includes(q)
    );
  });

  const downloadExcel = async () => {
    const response = await axios.get(
      `/api/allotment/session/${selectedSession}/excel`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;
    link.download = `${selectedSession}.xlsx`;

    document.body.appendChild(link);

    link.click();

    link.remove();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="h-6" />

      <div className="flex flex-wrap justify-center items-center gap-4 mt-10 mb-8 px-10">
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="border border-border rounded-lg px-4 py-2 bg-background"
          disabled={sessions.length === 0}
        >
          {sessions.length === 0 ? (
            <option value="">No sessions available</option>
          ) : (
            sessions.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))
          )}
        </select>

        <div className="relative w-full max-w-xl">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students..."
            className="pl-10 rounded-lg"
          />

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RotateCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
        <Button
          onClick={downloadExcel}
          disabled={studentsData.length === 0}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Download Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 mb-8">
        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-muted-foreground">
            Sponsored Students
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.totalStudents || 0}
          </h2>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <p className="text-muted-foreground">
            Sponsors
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.totalSponsors || 0}
          </h2>
        </div>
      </div>

      <div className="space-y-6 px-10 pb-10">
        {loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No sponsorship data found for this session.
          </div>
        )
          : (
            filteredStudents.map((student) => (
              <div
                key={student._id}
                className="bg-card border border-border shadow-sm rounded-lg p-6 flex flex-col transition hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex flex-col items-center md:items-start space-y-3 md:space-y-0 md:space-x-4 md:flex-row">
                    <img
                      src={student.profilePhoto || "/user.svg"}
                      alt={student.studentName}
                      onError={(e) => (e.target.src = "/user.svg")}
                      className="w-20 h-20 object-cover rounded-lg bg-muted"
                    />

                    <div className="text-center md:text-left">
                      <Link
                        to={`/admin/${encodeURIComponent(student.rollNumber)}`}
                        className="flex items-center h-full"
                      >
                        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                          {student.studentName}
                        </h2>
                      </Link>

                      <p className="text-sm text-muted-foreground mt-1">
                        Class: {student.class}
                      </p>

                      <p className="text-sm text-muted-foreground mt-1">
                        Centre: {student.centre}
                      </p>

                      <p className="text-sm text-muted-foreground mt-1">
                        School: {student.school || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 md:mt-0 flex items-center space-x-3">
                    <p className="text-sm font-medium text-foreground">
                      Number Of Sponsors
                    </p>

                    <Badge
                      variant="secondary"
                      className="font-semibold bg-[#21526E] text-white"
                    >
                      {student.sponsorCount || 0}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpand(student._id)}
                    className="gap-2"
                  >
                    {expanded === student._id ? (
                      <>
                        Hide Sponsors
                        <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        View Sponsors
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>

                {expanded === student._id && (
                  <div className="mt-6 border-t border-border pt-6">
                    <Table className="text-sm">
                      <TableHeader>
                        <tr className="bg-gradient-to-r from-primary/10 to-primary/5 border-b-2 border-primary/30">
                          <TableHead className="font-bold text-primary py-3 px-4">
                            Name
                          </TableHead>

                          <TableHead className="font-bold text-primary py-3 px-4">
                            Email
                          </TableHead>

                          <TableHead className="font-bold text-primary py-3 px-4">
                            Contact No.
                          </TableHead>

                        </tr>
                      </TableHeader>

                      <TableBody>
                        {student.sponsors?.map((sponsor) => (
                          <TableRow
                            key={sponsor._id}
                            className="hover:bg-primary/10"
                          >
                            <TableCell className="font-medium">
                              {sponsor.name}
                            </TableCell>

                            <TableCell>
                              {sponsor.email}
                            </TableCell>

                            <TableCell>
                              {sponsor.contactNumber || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            ))
          )}
      </div>
    </div>
  );
}