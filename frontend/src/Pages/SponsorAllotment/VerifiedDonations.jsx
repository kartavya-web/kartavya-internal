import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { TableHead } from "@/components/ui/table";
import { TableRow } from "@/components/ui/table";
import { TableHeader } from "@/components/ui/table";
import { Table } from "@/components/ui/table";
import { useSponsor } from "@/context/SponsorContext.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const sponsorDonations = [
  {
    user: "adfsdfsdfsdssdfsdfsd", // userId
    name: "Divyansh Gupta",
    donations: [
      {
        donationId: "dfsdfsdfsdfsdffs",
        date: new Date("2024-02-20T10:30:00Z"), // MongoDB date format
        numChild: 3,
      },
      {
        donationId: "aabbccddeeffgghh",
        date: new Date("2024-01-15T14:45:00Z"),
        numChild: 2,
      },
      {
        donationId: "zzxxccvvbbnnmm",
        date: new Date("2023-12-10T09:00:00Z"),
        numChild: 5,
      },
    ],
  },
  {
    user: "ghijklmnoqrstuvwxyz", // userId
    name: "Ananya Sharma",
    donations: [
      {
        donationId: "123456789abcdef",
        date: new Date("2024-02-01T12:00:00Z"),
        numChild: 4,
      },
      {
        donationId: "abcdef123456789",
        date: new Date("2023-11-25T16:20:00Z"),
        numChild: 6,
      },
    ],
  },
  {
    user: "pqrs9876543210xyz", // userId
    name: "Rahul Verma",
    donations: [
      {
        donationId: "qwertyuiopasdfgh",
        date: new Date("2024-01-10T08:15:00Z"),
        numChild: 1,
      },
      {
        donationId: "zxcvbnmlkjhgfdsa",
        date: new Date("2023-10-05T18:30:00Z"),
        numChild: 3,
      },
    ],
  },
];

//child-sponsor-map dummy data
// {
//   "_id": {
//     "$oid": "67c35275a694442e53af9079"
//   },
//   "user": {
//     "$oid": "6797b538702bd44e7da764f4"
//   },
//   "name": "Anuj Kumar",
//   "donations": [],
//   "createdAt": {
//     "$date": "2025-03-01T00:00:00.000Z"
//   },
//   "updatedAt": {
//     "$date": "2025-03-05T12:32:08.612Z"
//   },
//   "__v": 1
// }

export default function VerifiedDonations() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifiedDonations, setVerifiedDonations] = useState([]);
  const token = localStorage.getItem("token");
  const { setSponsorId, setSponsorName } = useSponsor();

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/allotment`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch verified donations");

        const data = await response.json();

        // Sorting donations within each sponsor by date
        const sortedData = data
          .map((sponsor) => ({
            ...sponsor,
            donations: sponsor.donations.sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            ),
          }))
          // Sorting sponsors based on their earliest donation
          .sort((a, b) => {
            const firstDonationA =
              a.donations.length > 0 ? new Date(a.donations[0].date) : Infinity;
            const firstDonationB =
              b.donations.length > 0 ? new Date(b.donations[0].date) : Infinity;
            return firstDonationA - firstDonationB;
          });

        setVerifiedDonations(sortedData);
      } catch (error) {
        toast.error("Error fetching verified donations");
        console.error("Error fetching verified donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const handleClick = (sponsorId, sponsorName) => {
    setSponsorId(sponsorId);
    setSponsorName(sponsorName);
    console.log(sponsorId, "here");
    navigate("/allotment/action");
  };

  if (loading) {
    return <Loader />;
  }

  if (verifiedDonations?.length == 0) {
    return (
      <div className="w-full h-[400px] flex justify-center items-center text-2xl font-semibold">
        <div className="w-1/2 flex flex-col justify-center items-center gap-10 py-10 bg-muted rounded-lg border">
          There are no verified donations pending allotment.
          <Button onClick={() => navigate("/")}> Go to home page</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center space-y-10 p-10 w-full">
      {verifiedDonations?.map((sponsor, index1) => (
        <div
          key={sponsor.user}
          className="w-11/12 max-w-5xl border rounded-2xl shadow-md overflow-hidden"
        >
          {/* Sponsor Name Header */}
          <div className="p-4 text-lg text-gray-800 font-semibold border-b bg-gray-100">
            {sponsor.name}
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-200 hover:!bg-gray-200">
                <TableHead className="w-1/2 text-gray-700 text-base font-semibold text-left pl-6 py-3">
                  Date
                </TableHead>
                <TableHead className="w-1/4 text-gray-700 text-base font-semibold py-3">
                  No of Children
                </TableHead>
                <TableHead className="w-1/4 text-gray-700 text-base font-semibold text-right pr-6 py-3">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sponsor?.donations?.map((donation, index2) => (
                <TableRow
                  key={donation.donationId}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell className="pl-6 text-gray-900 text-base font-medium py-3">
                    {new Date(donation.date)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}
                  </TableCell>
                  <TableCell className="text-gray-900 text-base font-medium py-3">
                    {donation.numChild}
                  </TableCell>
                  <TableCell className="pr-6 text-right py-3">
                    {index1 === 0 && index2 === 0 && (
                      <Button
                        onClick={() => handleClick(sponsor.user, sponsor.name)}
                        className="h-8 bg-[#025f43] hover:bg-[#1a604a] text-white px-5 py-1 rounded-lg text-base font-medium transition"
                      >
                        Allot Child
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
