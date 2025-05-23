import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

interface Meeting {
  id: string;
  topic: string;
  start_time: string;
  join_url: string;
  recording_files?: any[];
}

interface TranscriptionState {
  [meetingId: string]: {
    loading: boolean;
    text: string | null;
    summary: string | null;
    error: string | null;
    instruction: string;
  };
}

const EmmaAgent: React.FC = () => {
  const {
    isAuthenticated,
    user,
    zoomToken,
    refreshZoomToken,
    setZoomToken,
    teamsToken,
    setTeamsToken,
    refreshTeamsToken,
  } = useAuth();

  const navigate = useNavigate();

  // Vérification si l'utilisateur est abonné
  const isSubscriber = user?.isSubscriber || false;

  // États pour la vue fonctionnelle
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);
  const [pastMeetings, setPastMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [transcriptions, setTranscriptions] = useState<TranscriptionState>({});
  const [teamsMeetings, setTeamsMeetings] = useState<Meeting[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  // Ne charger les données que pour les abonnés
  useEffect(() => {
    if (!isSubscriber) {
      setIsLoading(false);
      return;
    }

    const fetchMeetings = async (retry = false) => {
      try {
        const [upcomingResponse, pastResponse] = await Promise.all([
          apiZoomGet(
            "http://localhost:3000/api/zoom/meetings?type=upcoming",
            zoomToken!
          ),
          apiZoomGet(
            "http://localhost:3000/api/zoom/meetings?type=past",
            zoomToken!
          ),
        ]);

        setUpcomingMeetings(upcomingResponse.data.meetings);

        // Pour chaque réunion passée, récupérer les fichiers d'enregistrement
        const pastMeetingsWithRecordings = await Promise.all(
          pastResponse.data.meetings.map(async (meeting: any) => {
            try {
              const recRes = await apiZoomGet(
                `http://localhost:3000/api/zoom/meetings/${meeting.id}/recordings`,
                zoomToken!
              );
              return {
                ...meeting,
                recording_files: recRes.data.recording_files || [],
              };
            } catch {
              return { ...meeting, recording_files: [] };
            }
          })
        );
        setPastMeetings(pastMeetingsWithRecordings);
      } catch (err: any) {
        // Gestion du refresh token si expiré (pour les appels principaux)
        const zoomError =
          err?.response?.data?.code === 124 ||
          err?.response?.data?.message === "Access token is expired.";
        if (zoomError && !retry) {
          const newToken = await refreshZoomToken();
          if (newToken) {
            setZoomToken(newToken);
            await fetchMeetings(true);
            return;
          }
        }
        setError("Erreur lors de la récupération des réunions");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (zoomToken) {
      fetchMeetings();
    } else {
      setIsLoading(false);
    }
  }, [
    isSubscriber,
    isAuthenticated,
    navigate,
    zoomToken,
    refreshZoomToken,
    setZoomToken,
  ]);

  // Fonction utilitaire pour GET Zoom avec gestion du refresh
  const apiZoomGet = async (
    url: string,
    token: string,
    retry = false
  ): Promise<any> => {
    try {
      return await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err: any) {
      const zoomError =
        err?.response?.data?.code === 124 ||
        err?.response?.data?.message === "Access token is expired.";
      if (zoomError && !retry) {
        const newToken = await refreshZoomToken();
        if (newToken) {
          setZoomToken(newToken);
          return await apiZoomGet(url, newToken, true);
        }
      }
      throw err;
    }
  };

  // Fonction utilitaire pour GET Teams avec gestion du refresh
  const apiTeamsGet = async (
    url: string,
    token: string,
    retry = false
  ): Promise<any> => {
    console.log("Appel API Teams:", url);
    console.log("Token Teams utilisé:", token);
    try {
      return await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err: any) {
      const teamsError =
        err?.response?.data?.error === "invalid_grant" ||
        err?.response?.data?.error_description?.includes("expired") ||
        err?.response?.data?.error === "InvalidAuthenticationToken" ||
        (err?.response?.data?.message &&
          err?.response?.data?.message.includes("expired"));
      if (teamsError && !retry) {
        const newToken = await refreshTeamsToken();
        if (newToken) {
          setTeamsToken(newToken);
          return await apiTeamsGet(url, newToken, true);
        }
      }
      throw err;
    }
  };

  // Fonction utilitaire pour POST Teams avec gestion du refresh
  const apiTeamsPost = async (
    url: string,
    data: any,
    token: string,
    retry = false
  ): Promise<any> => {
    console.log("Appel API Teams POST:", url);
    console.log("Token Teams utilisé:", token);
    try {
      return await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err: any) {
      const teamsError =
        err?.response?.data?.error === "invalid_grant" ||
        err?.response?.data?.error_description?.includes("expired") ||
        err?.response?.data?.error === "InvalidAuthenticationToken" ||
        (err?.response?.data?.message &&
          err?.response?.data?.message.includes("expired"));
      if (teamsError && !retry) {
        const newToken = await refreshTeamsToken();
        if (newToken) {
          setTeamsToken(newToken);
          return await apiTeamsPost(url, data, newToken, true);
        }
      }
      throw err;
    }
  };

  // Connexion Teams
  const handleConnectTeams = () => {
    window.location.href = "http://localhost:3000/api/teams/oauth";
  };

  // Récupération des réunions Teams
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!teamsToken) {
      console.log(
        "[Teams] Aucun token Teams présent, impossible de récupérer les réunions Teams."
      );
      setTeamsError(
        "Vous n'êtes pas connecté à Teams ou le token est manquant. Veuillez vous connecter à Teams."
      );
      return;
    }
    setIsLoadingTeams(true);
    const fetchTeamsMeetings = async (retry = false) => {
      try {
        console.log(
          "[Teams] Début récupération réunions Teams (via /api/teams/events) avec token:",
          teamsToken
        );
        const response = await apiTeamsGet(
          "http://localhost:3000/api/teams/events",
          teamsToken!
        );

        const meetingsData = response.data.meetings.map((meeting: any) => ({
          id: meeting.id,
          topic: meeting.topic || "Réunion Teams",
          start_time: meeting.start_time || "",
          join_url: meeting.join_url || "",
          recording_files: [],
        }));

        const meetingsWithRecordingsPromises = meetingsData.map(
          async (meeting: Meeting) => {
            try {
              console.log(
                `[Teams] Récupération des enregistrements pour la réunion ${meeting.id}`
              );
              const recRes = await apiTeamsGet(
                `http://localhost:3000/api/teams/meetings/${meeting.id}/recordings`,
                teamsToken!
              );
              return {
                ...meeting,
                recording_files: recRes.data.recordings || [],
              };
            } catch (recErr) {
              console.error(
                `[Teams] Erreur lors de la récupération des enregistrements pour la réunion ${meeting.id}:`,
                recErr
              );
              return { ...meeting, recording_files: [] };
            }
          }
        );
        const meetingsWithRecordings = await Promise.all(
          meetingsWithRecordingsPromises
        );

        meetingsWithRecordings.sort(
          (a, b) =>
            new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
        );

        setTeamsMeetings(meetingsWithRecordings);
      } catch (err: any) {
        const teamsSpecificError =
          err?.response?.data?.error === "invalid_grant" ||
          err?.response?.data?.error_description?.includes("expired");
        if (teamsSpecificError && !retry) {
          const newToken = await refreshTeamsToken();
          if (newToken) {
            setTeamsToken(newToken);
            await fetchTeamsMeetings(true);
            return;
          }
        }
        setTeamsError(
          err?.response?.data?.error ||
            "Erreur lors de la récupération des réunions Teams"
        );
        console.error(
          "[Teams] Erreur lors de la récupération des réunions Teams:",
          err
        );
      } finally {
        setIsLoadingTeams(false);
      }
    };
    fetchTeamsMeetings();
  }, [isAuthenticated, teamsToken, refreshTeamsToken, setTeamsToken]);

  const handleConnectZoom = () => {
    window.location.href = "http://localhost:3000/api/zoom/oauth";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleInstructionChange = (meetingId: string, value: string) => {
    setTranscriptions((prev) => ({
      ...prev,
      [meetingId]: {
        ...prev[meetingId],
        instruction: value,
      },
    }));
  };

  const handleTranscribeAudio = async (
    meetingId: string,
    downloadUrl: string
  ) => {
    const instruction = transcriptions[meetingId]?.instruction || "";
    setTranscriptions((prev) => ({
      ...prev,
      [meetingId]: {
        loading: true,
        text: null,
        summary: null,
        error: null,
        instruction,
      },
    }));

    const transcribe = async (token: string, retry = false) => {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/zoom/transcribe-audio",
          { downloadUrl, summaryInstruction: instruction },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTranscriptions((prev) => ({
          ...prev,
          [meetingId]: {
            loading: false,
            text: res.data.transcription || "",
            summary: res.data.summary || "",
            error: null,
            instruction,
          },
        }));
      } catch (err: any) {
        const zoomError =
          err?.response?.data?.code === 124 ||
          err?.response?.data?.message === "Access token is expired.";
        if (zoomError && !retry) {
          const newToken = await refreshZoomToken();
          if (newToken) {
            setZoomToken(newToken);
            await transcribe(newToken, true);
            return;
          }
        }
        setTranscriptions((prev) => ({
          ...prev,
          [meetingId]: {
            loading: false,
            text: null,
            summary: null,
            error:
              err.response?.data?.error || "Erreur lors de la transcription",
            instruction,
          },
        }));
      }
    };
    await transcribe(zoomToken!);
  };

  const handleTranscribeTeamsAudio = async (
    meetingId: string,
    downloadUrl: string
  ) => {
    const instruction = transcriptions[meetingId]?.instruction || "";
    setTranscriptions((prev) => ({
      ...prev,
      [meetingId]: {
        loading: true,
        text: null,
        summary: null,
        error: null,
        instruction,
      },
    }));

    const transcribe = async (token: string, retry = false) => {
      try {
        const res = await apiTeamsPost(
          "http://localhost:3000/api/teams/transcribe-audio",
          { downloadUrl, summaryInstruction: instruction, meetingId },
          token
        );
        setTranscriptions((prev) => ({
          ...prev,
          [meetingId]: {
            loading: false,
            text: res.data.transcription || "",
            summary: res.data.summary || "",
            error: null,
            instruction,
          },
        }));
      } catch (err: any) {
        const teamsError =
          err?.response?.data?.error === "invalid_grant" ||
          err?.response?.data?.error_description?.includes("expired") ||
          err?.response?.data?.error === "InvalidAuthenticationToken" ||
          (err?.response?.data?.message &&
            err?.response?.data?.message.includes("expired"));
        if (teamsError && !retry) {
          const newToken = await refreshTeamsToken();
          if (newToken) {
            setTeamsToken(newToken);
            await transcribe(newToken, true);
            return;
          }
        }
        setTranscriptions((prev) => ({
          ...prev,
          [meetingId]: {
            loading: false,
            text: null,
            summary: null,
            error:
              err.response?.data?.error ||
              "Erreur lors de la transcription Teams",
            instruction,
          },
        }));
      }
    };
    await transcribe(teamsToken!);
  };

  // Vue pour les non-abonnés
  if (!isSubscriber) {
    return (
      <div className="min-h-screen bg-[#121316] text-white">
        {/* Hero Section */}
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">
            Automatisez vos comptes-rendus de réunion avec Emma
          </h1>
          <p className="text-gray-400 mb-8">
            Assistant IA intelligent pour la transcription et la synthèse de vos
            réunions Teams et Zoom
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Essayer Emma gratuitement
          </button>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="font-bold mb-2">Gagnez du temps</h3>
            <p className="text-gray-400">
              Obtenez des résumés automatiques de vos réunions en quelques
              minutes
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-bold mb-2">Ne manquez rien</h3>
            <p className="text-gray-400">
              Capture automatique des décisions et des points importants
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-bold mb-2">IA intelligente</h3>
            <p className="text-gray-400">
              Synthèses personnalisées selon vos besoins spécifiques
            </p>
          </div>
        </div>

        {/* How it works Section */}
        <div className="bg-[#181A20] py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Comment ça marche ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="bg-[#23242a] rounded-xl p-4 aspect-video flex items-center justify-center">
                <p className="text-gray-400">Interface démo</p>
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="text-blue-500 font-bold">1</div>
                  <div>
                    <h4 className="font-bold">Connectez vos comptes</h4>
                    <p className="text-gray-400">
                      Intégrez facilement vos comptes Teams et Zoom
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-blue-500 font-bold">2</div>
                  <div>
                    <h4 className="font-bold">Sélectionnez une réunion</h4>
                    <p className="text-gray-400">
                      Choisissez la réunion à transcrire
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-blue-500 font-bold">3</div>
                  <div>
                    <h4 className="font-bold">Obtenez votre synthèse</h4>
                    <p className="text-gray-400">
                      Recevez un compte-rendu intelligent en quelques minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Transform Your Meetings?
          </h2>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Get Started Now
          </button>
        </div>

        {/* Footer */}
        <footer className="bg-[#181A20] py-12">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Emma AI</h3>
              <p className="text-gray-400">
                Your intelligent meeting assistant
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>Integration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Vue fonctionnelle pour les abonnés
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121316] text-white flex flex-col">
      {/* Header section */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto py-12 px-4 gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Emma – Votre compte-rendu intelligent sur Zoom & Teams
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Connectez-vous, assistez, laissez l'IA s'occuper du reste.
          </p>
          {!zoomToken && (
            <button
              onClick={handleConnectZoom}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow mb-4"
            >
              Se connecter à Zoom
            </button>
          )}
          {/* Bouton connexion Teams */}
          {!teamsToken && (
            <button
              onClick={handleConnectTeams}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow mb-4 ml-2"
            >
              Se connecter à Teams
            </button>
          )}
          {/* Bouton Voir la démo */}
          <button
            onClick={() => {
              const videoSection = document.getElementById("demo-video");
              if (videoSection) {
                videoSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg text-base mt-2"
          >
            Voir la démo
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=cover&w=400&q=80"
            alt="Réunion Zoom IA"
            className="rounded-2xl shadow-lg w-full max-w-md object-cover"
          />
        </div>
      </div>

      {/* Ce que fait l'agent Emma */}
      <div className="bg-[#181A20] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Ce que fait l'agent Emma
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FeatureCard
              icon="🔒"
              title="Connexion sécurisée à Zoom/Teams"
              desc="Intégration sécurisée avec vos plateformes de visioconférence préférées."
            />
            <FeatureCard
              icon="📅"
              title="Détection automatique des réunions"
              desc="Ne manquez plus jamais une réunion importante."
            />
            <FeatureCard
              icon="✅"
              title="Autorisation d'enregistrement automatique"
              desc="Gestion automatique des permissions pour un enregistrement sans tracas."
            />
            <FeatureCard
              icon="🎤"
              title="Enregistrement ou transcript"
              desc="Capture fidèle de toutes les discussions importantes."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
            <FeatureCard
              icon="📝"
              title="Résumé automatique"
              desc="Synthèse intelligente des points clés abordés."
            />
            <FeatureCard
              icon="🧠"
              title="Décisions, tâches et actions"
              desc="Organisation claire des éléments à suivre après la réunion."
            />
            <FeatureCard
              icon="📄"
              title="Compte-rendu PDF ou texte"
              desc="Documents professionnels prêts à être partagés."
            />
            <FeatureCard
              icon="🔗"
              title="Partage facile"
              desc="Distribution simplifiée des comptes-rendus à tous les participants."
            />
          </div>
        </div>
      </div>

      {/* Placeholder vidéo démo déplacé ici */}
      <div
        id="demo-video"
        className="flex flex-col items-center justify-center max-w-5xl mx-auto my-12"
      >
        <div className="w-full h-96 bg-[#23242a] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-600">
          <svg
            className="w-24 h-24 text-gray-500 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.868v4.264a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <span className="text-gray-400 text-lg">
            Vidéo de démonstration à venir
          </span>
        </div>
      </div>

      {/* Pourquoi utiliser Emma */}
      <div className="bg-[#181A20] py-12 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Pourquoi utiliser Emma ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FeatureCard
              icon="⏳"
              title="Gain de temps"
              desc="Économisez des heures chaque semaine en automatisant la prise de notes et la création de comptes-rendus."
            />
            <FeatureCard
              icon="✔️"
              title="Fiabilité des résumés"
              desc="Des synthèses précises et complètes grâce à notre technologie d'IA avancée."
            />
            <FeatureCard
              icon="🧾"
              title="Moins de travail manuel"
              desc="Concentrez-vous sur les actions à mener plutôt que sur la documentation des discussions."
            />
            <FeatureCard
              icon="🤝"
              title="Alignement des participants"
              desc="Assurez-vous que chacun reparte avec la même compréhension des décisions prises."
            />
          </div>
        </div>
      </div>

      {/* Section transcription/réunions si connecté */}
      {zoomToken && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Vos réunions et transcriptions
          </h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {audioError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {audioError}
            </div>
          )}
          <section>
            <h3 className="text-xl font-semibold mb-4">Réunions à venir</h3>
            <div className="flex flex-col gap-4 w-full">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-[#23242a] h-[200px] flex flex-col"
                >
                  <div className="mb-4">
                    <h4 className="font-semibold text-lg line-clamp-1">
                      {meeting.topic}
                    </h4>
                    <p className="text-gray-400">
                      {formatDate(meeting.start_time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Réunions passées</h3>
            <div className="flex flex-col gap-4 w-full">
              {pastMeetings.map((meeting) => {
                const audioFile = meeting.recording_files?.find(
                  (file: any) =>
                    file.file_type === "audio_only" || file.file_type === "M4A"
                );
                return (
                  <div
                    key={meeting.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-[#23242a] min-h-[200px] flex flex-col"
                  >
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg line-clamp-1">
                        {meeting.topic}
                      </h4>
                      <p className="text-gray-400">
                        {formatDate(meeting.start_time)}
                      </p>
                    </div>
                    {audioFile && (
                      <div className="mt-4">
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder="Fais un résumé en 3 phrases"
                            value={
                              transcriptions[meeting.id]?.instruction || ""
                            }
                            onChange={(e) =>
                              handleInstructionChange(
                                meeting.id,
                                e.target.value
                              )
                            }
                            className="border px-2 py-1 rounded w-full mb-2 bg-[#181A20] text-white"
                            disabled={transcriptions[meeting.id]?.loading}
                          />
                          <button
                            onClick={() =>
                              handleTranscribeAudio(
                                meeting.id,
                                audioFile.download_url
                              )
                            }
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded"
                            disabled={transcriptions[meeting.id]?.loading}
                          >
                            {transcriptions[meeting.id]?.loading
                              ? "Transcription..."
                              : "Transcrire"}
                          </button>
                        </div>
                      </div>
                    )}
                    {transcriptions[meeting.id]?.summary !== undefined &&
                      !transcriptions[meeting.id]?.loading &&
                      !transcriptions[meeting.id]?.summary && (
                        <div className="mt-4 p-3 bg-[#1a1c23] rounded border border-gray-700">
                          <strong className="text-gray-300">Résumé :</strong>
                          <div className="whitespace-pre-line mt-2">
                            <span className="italic text-gray-500">
                              Aucun résumé généré.
                            </span>
                          </div>
                        </div>
                      )}
                    {transcriptions[meeting.id]?.summary && (
                      <div className="mt-4 p-3 bg-[#1a1c23] rounded border border-gray-700">
                        <strong className="text-gray-300">Résumé :</strong>
                        <div className="whitespace-pre-line mt-2 text-gray-300">
                          {transcriptions[meeting.id].summary}
                        </div>
                      </div>
                    )}
                    {transcriptions[meeting.id]?.text && (
                      <div className="mt-4 p-3 bg-[#1a1c23] rounded border border-gray-700">
                        <strong className="text-gray-300">
                          Transcription complète :
                        </strong>
                        <div className="whitespace-pre-line mt-2 text-gray-300 max-h-[300px] overflow-y-auto">
                          {transcriptions[meeting.id].text}
                        </div>
                      </div>
                    )}
                    {transcriptions[meeting.id]?.error && (
                      <div className="mt-4 p-3 bg-red-900/20 text-red-400 rounded border border-red-800">
                        {transcriptions[meeting.id].error}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Section Teams si connecté */}
      {teamsToken && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Vos réunions Teams
          </h2>
          {teamsError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {typeof teamsError === "string"
                ? teamsError
                : JSON.stringify(teamsError, null, 2)}
            </div>
          )}
          <section>
            <h3 className="text-xl font-semibold mb-4">Réunions Teams</h3>
            {isLoadingTeams ? (
              <div>Chargement des réunions Teams...</div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                {teamsMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-[#23242a] min-h-[200px] flex flex-col"
                  >
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg line-clamp-1">
                        {meeting.topic}
                      </h4>
                      <p className="text-gray-400">
                        {formatDate(meeting.start_time)}
                      </p>
                    </div>
                    {(() => {
                      const firstPlayableRecording =
                        meeting.recording_files &&
                        meeting.recording_files.length > 0
                          ? meeting.recording_files[0]
                          : null;

                      if (firstPlayableRecording?.downloadUrl) {
                        return (
                          <div className="mt-4">
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                placeholder="Fais un résumé en 3 phrases"
                                value={
                                  transcriptions[meeting.id]?.instruction || ""
                                }
                                onChange={(e) =>
                                  handleInstructionChange(
                                    meeting.id,
                                    e.target.value
                                  )
                                }
                                className="border px-2 py-1 rounded w-full mb-2 bg-[#181A20] text-white"
                                disabled={transcriptions[meeting.id]?.loading}
                              />
                              <button
                                onClick={() =>
                                  handleTranscribeTeamsAudio(
                                    meeting.id,
                                    firstPlayableRecording.downloadUrl
                                  )
                                }
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded"
                                disabled={transcriptions[meeting.id]?.loading}
                              >
                                {transcriptions[meeting.id]?.loading
                                  ? "Transcription..."
                                  : "Transcrire (Teams)"}
                              </button>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <p className="text-sm text-gray-500 mt-4">
                          {meeting.recording_files?.length
                            ? "Enregistrement(s) trouvé(s) mais non accessible(s)"
                            : "Aucun enregistrement trouvé"}
                        </p>
                      );
                    })()}

                    {transcriptions[meeting.id]?.summary !== undefined &&
                      !transcriptions[meeting.id]?.loading &&
                      !transcriptions[meeting.id]?.summary && (
                        <div className="mt-4 p-3 bg-[#1a1c23] rounded border border-gray-700">
                          <strong className="text-gray-300">Résumé :</strong>
                          <div className="whitespace-pre-line mt-2">
                            <span className="italic text-gray-500">
                              Aucun résumé généré.
                            </span>
                          </div>
                        </div>
                      )}
                    {transcriptions[meeting.id]?.summary && (
                      <div className="mt-4 p-3 bg-[#1a1c23] rounded border border-gray-700">
                        <strong className="text-gray-300">Résumé :</strong>
                        <div className="whitespace-pre-line mt-2 text-gray-300">
                          {transcriptions[meeting.id].summary}
                        </div>
                      </div>
                    )}
                    {transcriptions[meeting.id]?.text && (
                      <div className="mt-4 p-3 bg-[#1a1c23] rounded border border-gray-700">
                        <strong className="text-gray-300">
                          Transcription complète :
                        </strong>
                        <div className="whitespace-pre-line mt-2 text-gray-300 max-h-[300px] overflow-y-auto">
                          {transcriptions[meeting.id].text}
                        </div>
                      </div>
                    )}
                    {transcriptions[meeting.id]?.error && (
                      <div className="mt-4 p-3 bg-red-900/20 text-red-400 rounded border border-red-800">
                        {transcriptions[meeting.id].error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Footer call-to-action */}
      <div className="w-full bg-blue-700 py-12 flex flex-col items-center justify-center mt-12 rounded-xl max-w-6xl mx-auto mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Prêt à laisser l'IA gérer vos réunions ?
        </h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/register")}
            className="bg-black hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-lg text-base shadow"
          >
            Activer cet agent
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 px-8 rounded-lg text-base shadow"
          >
            Voir les autres agents
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant pour les cartes de fonctionnalités
const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) => (
  <div className="flex flex-col items-center text-center bg-[#23242a] rounded-xl p-6 shadow">
    <div className="text-4xl mb-3">{icon}</div>
    <div className="font-semibold mb-2">{title}</div>
    <div className="text-gray-400 text-sm">{desc}</div>
  </div>
);

export default EmmaAgent;