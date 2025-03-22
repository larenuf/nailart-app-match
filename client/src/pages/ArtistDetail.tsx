import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/AppContext";
import { Artist } from "@/types";
import ArtistDetailView from "@/components/ArtistDetailView";

export default function ArtistDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { selectedArtist, setSelectedArtist } = useAppContext();
  
  const { data: artist } = useQuery<Artist>({
    queryKey: [`/api/artists/${id}`],
    enabled: !!id && !selectedArtist,
  });
  
  useEffect(() => {
    if (artist && !selectedArtist) {
      setSelectedArtist(artist);
    }
    
    // If there's no artist selected, redirect to home
    if (!selectedArtist && !artist) {
      setLocation('/');
    }
  }, [artist, selectedArtist, setSelectedArtist, setLocation]);
  
  if (!selectedArtist) return null;
  
  return <ArtistDetailView />;
}
