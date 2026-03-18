import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/filter?type=video`);
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <div className="border-b bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            All <span className="text-purple-600">Videos</span> 🎬
          </h1>
          <p className="text-muted-foreground">
            Explore all our design videos and tutorials
          </p>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-muted/10 rounded-lg">
            <div className="max-w-md mx-auto">
              <ShoppingBag
                className="h-16 w-16 mx-auto text-muted-foreground mb-4"
                strokeWidth={1.5}
              />
              <h3 className="text-xl font-semibold mb-2">
                No Videos Available
              </h3>
              <p className="text-muted-foreground mb-6">
                Videos will appear here once the admin uploads them.
              </p>
              <Link to="/">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, index) => (
              <Link
                key={video._id}
                to={`/product/${video._id}`}
                className="group"
              >
                <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  {/* Badge */}
                  {index < 3 && (
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                          index === 0
                            ? "bg-red-500 text-white"
                            : index === 1
                              ? "bg-orange-500 text-white"
                              : "bg-pink-500 text-white"
                        }`}
                      >
                        {index === 0 ? "LIVE" : index === 1 ? "TRENDING" : "NEW"}
                      </span>
                    </div>
                  )}

                  {/* Video Preview */}
                  <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-blue-100">
                    {video.previewVideoUrl ? (
                      <>
                        <video
                          src={video.previewVideoUrl}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          onMouseEnter={(e) => e.target.play()}
                          onMouseLeave={(e) => e.target.pause()}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="h-8 w-8 text-purple-600 fill-purple-600 ml-1" />
                          </div>
                        </div>
                      </>
                    ) : video.previewImagesUrls && video.previewImagesUrls[0] ? (
                      <>
                        <img
                          src={video.previewImagesUrls[0]}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="h-8 w-8 text-purple-600 fill-purple-600 ml-1" />
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>

                  {/* Video Info */}
                  <div className="p-5 bg-white">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {video.description || "Watch this amazing video"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-mono font-semibold text-purple-600">
                        ₹{video.price}
                      </span>
                      {video.isFree && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                          FREE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t py-12 mt-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Pixeladda</h3>
              <p className="text-sm text-muted-foreground">
                Premium design templates and video tutorials for creative professionals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-muted-foreground hover:text-primary"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Phone: +91 98203 29571</li>
                <li>Email: support@pixeladda.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Pixeladda. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
