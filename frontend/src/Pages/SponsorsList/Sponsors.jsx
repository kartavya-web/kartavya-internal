// frontend/src/Pages/SponsorsList/Sponsors.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
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


export default function Sponsors() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [sponsorsData, setSponsorsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!AuthVerify()) {
      navigate("/login", { replace: true });
    }
  }, []);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        console.log('Fetching sponsors...');
        const res = await axios.get("/api/users/sponsors", {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Response:', res);
        console.log('Sponsors data received:', res.data);
        if (Array.isArray(res.data)) {
          setSponsorsData(res.data);
        } else {
          console.error('Received non-array data:', res.data);
          setSponsorsData([]);
        }
      } catch (err) {
        console.error("Error fetching sponsors:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const filteredSponsors = sponsorsData
    .filter((sponsor) => {
      const q = (query || "").toLowerCase().trim();
      if (!q) return true;
      const nameMatch = (sponsor.name || "").toLowerCase().includes(q);
      const studentMatch = (sponsor.sponsoredStudents || []).some((s) =>
        (s.studentName || "").toLowerCase().includes(q)
      );
      return nameMatch || studentMatch;
    })
    .sort((a, b) => (b.sponsoredStudents?.length || 0) - (a.sponsoredStudents?.length || 0));

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  // show search bar immediately and render inline loader in the list area

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar removed as requested; keep top spacing */}
      <div className="h-6" />

      <div className="flex justify-center mt-10 mb-8">
        <div className="relative w-full max-w-xl">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sponsors..."
            className="pl-10 rounded-lg"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      <div className="space-y-6 px-10 pb-10">
        {loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : (
          filteredSponsors.map((sponsor) => (
          <div
            key={sponsor._id}
            className="bg-card border border-border shadow-sm rounded-lg p-6 flex flex-col transition hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex flex-col items-center md:items-start space-y-3 md:space-y-0 md:space-x-4 md:flex-row">
                <img
                  src={sponsor.profileImage || "https://via.placeholder.com/120x120"}
                  alt={sponsor.name}
                  className="w-20 h-20 object-cover rounded-lg bg-muted text-center"
                />
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {sponsor.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{sponsor.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">Contact: {sponsor.contactNumber}</p>
                </div>
              </div>

              <div className="mt-5 md:mt-0 flex items-center space-x-3">
                <p className="text-sm font-medium text-foreground">Number Of Students Sponsored</p>
                <Badge variant="secondary" className="font-semibold bg-[#21526E] text-white">
                   {sponsor.sponsoredStudents?.length || 0}
                  </Badge>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleExpand(sponsor._id)}
                className="gap-2"
              >
                {expanded === sponsor._id ? (
                  <>
                    Hide Students <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    View Students <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {expanded === sponsor._id && (
              <div className="mt-6 border-t border-border pt-6">
                <Table className="text-sm">
                  <TableHeader>
                    <tr className="bg-gradient-to-r from-primary/10 to-primary/5 border-b-2 border-primary/30">
                      <TableHead className="font-bold text-primary py-3 px-4">Name</TableHead>
                      <TableHead className="font-bold text-primary py-3 px-4">Class</TableHead>
                      <TableHead className="font-bold text-primary py-3 px-4">Centre</TableHead>
                      <TableHead className="font-bold text-primary py-3 px-4">School Name</TableHead>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {sponsor.sponsoredStudents?.map((student, index) => (
                      <TableRow 
                        key={student._id} 
                        className={`border-b border-border transition-all duration-200 ${
                          index % 2 === 0 ? "bg-background" : "bg-primary/5"
                        } hover:bg-primary/10`}
                      >
                        <TableCell className="text-foreground py-3 px-4">
                          <Button
                            asChild
                            variant="link"
                            className="p-0 h-auto text-primary font-semibold hover:text-primary/80 hover:underline underline-offset-2 transition-all duration-200"
                          >
                            <Link
                              to={`/admin/${encodeURIComponent(student.rollNumber)}`}
                            >
                              {student.studentName}
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell className="text-foreground py-3 px-4 font-medium">{student.class}</TableCell>
                        <TableCell className="text-foreground py-3 px-4 font-medium">{student.centre}</TableCell>
                        <TableCell className="text-foreground py-3 px-4 font-medium">{student.school || "N/A"}</TableCell>
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
