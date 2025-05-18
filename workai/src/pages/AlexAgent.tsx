import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

interface GeneratedContent {
  content: string;
  imageUrl?: string;
  suggestions?: string[];
}

interface CreditInfo {
  utilisés: number;
  limite: number;
  restants: number;
}

interface PredisConfig {
  post_types: string[];
  languages: string[];
  media_types: string[];
  video_durations: string[];
  color_palette_types: string[];
}

// Nouveaux types pour l'interface de création
interface Format {
  name: string;
  width: number;
  height: number;
  selected?: boolean;
}

interface CreativeType {
  name: string;
  description: string;
  icon: string;
}

interface AdSuggestion {
  text: string;
}

interface ContentSettings {
  imagePrompt: string;
  changeManually: boolean;
  headline: string;
  subheading: string;
  callToAction: string;
  discount: string;
  numberOfVariants: number;
  captionLength: "short" | "medium" | "long";
  template: "ai-picked";
  mediaType: "ai-generated" | "premium-stock" | "choose-media";
  showAdvancedSettings: boolean;
  uploadedImage?: File;
  uploadedImagePreview?: string;
}

const AlexAgent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // États pour le formulaire de génération
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [mediaType, setMediaType] = useState<
    "single_image" | "carousel" | "video"
  >("single_image");
  const [postType, setPostType] = useState("generic");
  const [inputLanguage, setInputLanguage] = useState("french");
  const [outputLanguage, setOutputLanguage] = useState("french");
  const [videoDuration, setVideoDuration] = useState("short");
  const [author, setAuthor] = useState("");
  const [colorPaletteType, setColorPaletteType] = useState("ai_suggested");
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string>("");
  const [retryAfter, setRetryAfter] = useState<number | null>(null);
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null);
  const [config, setConfig] = useState<PredisConfig | null>(null);

  // Nouveaux états pour l'interface de création
  const [showCreativeTypes, setShowCreativeTypes] = useState(false);
  const [showFormats, setShowFormats] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const [selectedCreativeType, setSelectedCreativeType] = useState<
    "single_image" | "video" | null
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<
    "business" | "ecommerce" | null
  >(null);

  const formats: Format[] = [
    { name: "Square", width: 1000, height: 1000 },
    { name: "Portrait", width: 1000, height: 1920 },
    { name: "Portrait", width: 1000, height: 1350 },
    { name: "Landscape", width: 1200, height: 720 },
  ];

  // États existants...
  const [showInputScreen, setShowInputScreen] = useState(false);
  const [adInput, setAdInput] = useState("");
  const [currentScreen, setCurrentScreen] = useState<
    "creator" | "input" | "content"
  >("creator");
  const [contentSettings, setContentSettings] = useState<ContentSettings>({
    imagePrompt: "",
    changeManually: false,
    headline: "",
    subheading: "",
    callToAction: "",
    discount: "",
    numberOfVariants: 1,
    captionLength: "short",
    template: "ai-picked",
    mediaType: "ai-generated",
    showAdvancedSettings: false,
  });

  // Suggestions d'exemples
  const adSuggestions: AdSuggestion[] = [
    {
      text: 'Create an ad for Serenity Spa. Title: "Relax, Refresh, Renew", tagline: "Experience Bliss with Our Signature Treatments", offer: "20% off first visit", button: "Book Your Appointment".',
    },
    {
      text: "Create an ad for Skyhigh Movers, focusing on our efficient and stress-free moving services.",
    },
    {
      text: 'Create an ad for Skyhigh Movers. Title: "Moving Made Simple", tagline: "Reliable Moving Services Tailored to You", button: "Schedule Your Move".',
    },
    {
      text: "Create an ad for Sparkle Cleaners, promoting our eco-friendly home cleaning services.",
    },
    {
      text: 'Create an ad for Sparkle Cleaners. Title: "A Cleaner Home, A Happier You", tagline: "Eco-Friendly Cleaning Services You Can Trust", offer: "15% off on first clean", button: "Book Now".',
    },
  ];

  // Charger la configuration et les crédits au montage du composant
  React.useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [creditsResponse, configResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/predis/credits"),
          axios.get("http://localhost:3000/api/predis/config"),
        ]);
        setCreditInfo(creditsResponse.data.credits);
        setConfig(configResponse.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données initiales:",
          error
        );
      }
    };
    loadInitialData();
  }, []);

  // Fonction de génération de contenu
  const handleGenerateContent = async () => {
    try {
      setIsLoading(true);
      setError("");
      setGeneratedContent(null);

      const response = await axios.post(
        "http://localhost:3000/api/predis/generate",
        {
          topic,
          media_type: "single_image",
          input_language: "french",
          output_language: "french",
          color_palette_type: "ai_suggested",
        }
      );

      console.log("Réponse:", response.data);
      setGeneratedContent({
        content: response.data.content,
        imageUrl: response.data.imageUrl,
        suggestions: response.data.suggestions,
      });

      if (response.data.credits) {
        setCreditInfo(response.data.credits);
      }
    } catch (error: any) {
      console.error("Erreur lors de la génération:", error);
      setError(error.response?.data?.details || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: "business" | "ecommerce") => {
    setSelectedCategory(category);
    setShowCreativeTypes(true);
  };

  const handleCreativeTypeSelect = (type: "single_image" | "video") => {
    setSelectedCreativeType(type);
    setShowFormats(true);
  };

  const handleFormatSelect = (format: Format) => {
    setSelectedFormat(format);
  };

  const handleContinue = () => {
    if (selectedFormat) {
      setCurrentScreen("input");
      setShowInputScreen(true);
      setMediaType(selectedCreativeType || "single_image");
    }
  };

  const handleBack = () => {
    if (currentScreen === "content") {
      setCurrentScreen("input");
    } else if (currentScreen === "input") {
      setCurrentScreen("creator");
      setShowInputScreen(false);
    }
  };

  // Gestionnaires d'événements pour les paramètres de contenu
  const handleSettingsChange = (key: keyof ContentSettings, value: any) => {
    setContentSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleAdvancedSettings = () => {
    setContentSettings((prev) => ({
      ...prev,
      showAdvancedSettings: !prev.showAdvancedSettings,
    }));
  };

  const generateDefaultCopy = () => {
    // Simuler la génération automatique du contenu
    return {
      headline: "Move Stress-Free with Skyhigh Movers' Expert Team",
      subheading:
        "Experience a smooth transition with our reliable moving services",
      callToAction: "Get Quote",
    };
  };

  const handleGenerateAd = async () => {
    try {
      setIsLoading(true);
      setError("");
      setGeneratedContent(null);

      // Préparation des données pour l'API
      const apiData = {
        topic: adInput,
        media_type: selectedCreativeType || "single_image",
        input_language: "french",
        output_language: "french",
        color_palette_type: "ai_suggested",
        video_duration: selectedCreativeType === "video" ? "short" : undefined,
      };

      // Si une image est uploadée, on doit d'abord l'envoyer
      let uploadedImageUrl;
      if (contentSettings.uploadedImage) {
        console.log(
          "Tentative d'upload de l'image:",
          contentSettings.uploadedImage
        );
        const formData = new FormData();
        formData.append("file", contentSettings.uploadedImage);

        const uploadResponse = await axios.post(
          "http://localhost:3000/api/predis/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          }
        );

        if (uploadResponse.data && uploadResponse.data.url) {
          uploadedImageUrl = uploadResponse.data.url;
          console.log("Image uploadée avec succès:", uploadedImageUrl);
        } else {
          throw new Error("Erreur lors de l'upload de l'image: URL non reçue");
        }
      }

      // Appel principal à l'API de génération
      console.log("Données envoyées à l'API:", {
        ...apiData,
        uploadedImageUrl: uploadedImageUrl || undefined,
      });

      const response = await axios.post(
        "http://localhost:3000/api/predis/generate",
        {
          ...apiData,
          uploadedImageUrl: uploadedImageUrl || undefined,
        }
      );

      console.log("Réponse de l'API:", response.data);

      setGeneratedContent({
        content: response.data.content,
        imageUrl: response.data.imageUrl,
        suggestions: response.data.suggestions,
      });

      if (response.data.credits) {
        setCreditInfo(response.data.credits);
      }

      setCurrentScreen("content");
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.details || error.message);
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type et la taille du fichier
      if (!file.type.startsWith("image/")) {
        alert("Veuillez sélectionner un fichier image");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB max
        alert("L'image ne doit pas dépasser 5MB");
        return;
      }

      // Créer une URL pour la prévisualisation
      const previewUrl = URL.createObjectURL(file);

      handleSettingsChange("uploadedImage", file);
      handleSettingsChange("uploadedImagePreview", previewUrl);
      handleSettingsChange("mediaType", "choose-media");
    }
  };

  // Nettoyer l'URL de prévisualisation lors du démontage du composant
  React.useEffect(() => {
    return () => {
      if (contentSettings.uploadedImagePreview) {
        URL.revokeObjectURL(contentSettings.uploadedImagePreview);
      }
    };
  }, [contentSettings.uploadedImagePreview]);

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    navigate("/signin");
    return null;
  }

  // Vérification si l'utilisateur est abonné
  const isSubscriber = user?.isSubscriber || false;

  // Vue pour les non-abonnés
  if (!isSubscriber) {
    return (
      <div className="min-h-screen bg-[#121316] text-white">
        {/* Hero Section */}
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-4">
            Créez du contenu viral en 30 secondes avec Alex
          </h1>
          <p className="text-gray-400 mb-8">
            Assistant IA intelligent pour la génération et la planification de
            contenu sur vos réseaux sociaux
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Essayer Alex
          </button>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-bold mb-2">Création rapide</h3>
            <p className="text-gray-400">
              Générez du contenu engageant en quelques secondes
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="font-bold mb-2">Contenu ciblé</h3>
            <p className="text-gray-400">
              Adapté à votre audience et à votre plateforme
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="font-bold mb-2">Planification intelligente</h3>
            <p className="text-gray-400">
              Programmation optimisée pour maximiser l'engagement
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
                    <h4 className="font-bold">Donnez vos instructions</h4>
                    <p className="text-gray-400">
                      Décrivez simplement le contenu que vous souhaitez créer
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-blue-500 font-bold">2</div>
                  <div>
                    <h4 className="font-bold">Génération IA</h4>
                    <p className="text-gray-400">
                      Alex crée du contenu adapté à vos besoins
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-blue-500 font-bold">3</div>
                  <div>
                    <h4 className="font-bold">Publication automatique</h4>
                    <p className="text-gray-400">
                      Planifiez et publiez en un clic sur vos réseaux
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Inclus dans l'abonnement Pro
            </h2>
            <div className="bg-[#23242a] rounded-xl p-8 max-w-md mx-auto text-center">
              <div className="text-4xl font-bold mb-4">
                29€<span className="text-xl text-gray-400">/mois</span>
              </div>
              <p className="text-gray-400 mb-8">
                Sans engagement. Essai gratuit disponible.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg w-full"
              >
                Commencer l'essai gratuit
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold mb-8">
            Prêt à révolutionner votre présence en ligne ?
          </h2>
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
          >
            Commencer maintenant
          </button>
        </div>
      </div>
    );
  }

  // Vue pour les abonnés
  return (
    <div className="min-h-screen bg-[#121316] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {currentScreen === "creator" ? (
          <>
            <h1 className="text-4xl font-bold mb-8 text-center">
              Créateur et Générateur
            </h1>
            {/* Section de création */}
            <div className="space-y-8 max-w-3xl mx-auto">
              {/* Sélection de catégorie */}
              <div className="grid grid-cols-2 gap-6">
                <div
                  onClick={() => handleCategorySelect("business")}
                  className={`bg-[#1E1F23] p-6 rounded-xl cursor-pointer hover:bg-[#2A2B31] transition-all duration-300 ${
                    selectedCategory === "business"
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-2">
                    For Business & Services
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#2A2B31] p-4 rounded-lg hover:bg-[#32333A]">
                      <div className="text-blue-500 mb-2">🎨</div>
                      <h3 className="font-medium">Ad Creatives</h3>
                      <p className="text-sm text-gray-400">
                        Design impactful ads to drive results
                      </p>
                    </div>
                    <div className="bg-[#2A2B31] p-4 rounded-lg hover:bg-[#32333A]">
                      <div className="text-purple-500 mb-2">📱</div>
                      <h3 className="font-medium">Social Media</h3>
                      <p className="text-sm text-gray-400">
                        Boost your brand's online presence
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => handleCategorySelect("ecommerce")}
                  className={`bg-[#1E1F23] p-6 rounded-xl cursor-pointer hover:bg-[#2A2B31] transition-all duration-300 ${
                    selectedCategory === "ecommerce"
                      ? "border-2 border-blue-500"
                      : ""
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-2">
                    For eCommerce Products
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#2A2B31] p-4 rounded-lg hover:bg-[#32333A]">
                      <div className="text-blue-500 mb-2">🛍️</div>
                      <h3 className="font-medium">Ad Creatives</h3>
                      <p className="text-sm text-gray-400">
                        Create promotions to drive sales and conversions
                      </p>
                    </div>
                    <div className="bg-[#2A2B31] p-4 rounded-lg hover:bg-[#32333A]">
                      <div className="text-purple-500 mb-2">💫</div>
                      <h3 className="font-medium">Social Media</h3>
                      <p className="text-sm text-gray-400">
                        Showcase your products to build brand awareness
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sélection du type de création */}
              {showCreativeTypes && (
                <div className="animate-fade-in mt-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Select Creative Type
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div
                      onClick={() => handleCreativeTypeSelect("single_image")}
                      className={`bg-[#1E1F23] p-6 rounded-xl cursor-pointer hover:bg-[#2A2B31] transition-all duration-300 ${
                        selectedCreativeType === "single_image"
                          ? "border-2 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="text-green-500 mb-2">🖼️</div>
                      <h3 className="font-medium">Single Image</h3>
                      <p className="text-sm text-gray-400">
                        A single template post
                      </p>
                    </div>
                    <div
                      onClick={() => handleCreativeTypeSelect("video")}
                      className={`bg-[#1E1F23] p-6 rounded-xl cursor-pointer hover:bg-[#2A2B31] transition-all duration-300 ${
                        selectedCreativeType === "video"
                          ? "border-2 border-blue-500"
                          : ""
                      }`}
                    >
                      <div className="text-blue-500 mb-2">🎥</div>
                      <h3 className="font-medium">Video</h3>
                      <p className="text-sm text-gray-400">
                        Create engaging videos with ease
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sélection du format */}
              {showFormats && (
                <div className="animate-fade-in mt-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Select a canvas size to proceed
                  </h2>
                  <div className="grid grid-cols-4 gap-4">
                    {formats.map((format, index) => (
                      <div
                        key={`${format.name}-${index}`}
                        onClick={() => handleFormatSelect(format)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedFormat === format
                            ? "bg-[#1E1F23] border-2 border-blue-500"
                            : "bg-[#1E1F23] hover:bg-[#2A2B31]"
                        }`}
                      >
                        <div className="aspect-square bg-[#2A2B31] rounded-lg mb-2 flex items-center justify-center opacity-80">
                          <div
                            className={`w-8 h-8 border-2 border-gray-500 ${
                              format.name === "Square"
                                ? "aspect-square"
                                : format.name === "Portrait"
                                ? "aspect-[9/16]"
                                : "aspect-[16/9]"
                            }`}
                          ></div>
                        </div>
                        <h3 className="font-medium text-center">
                          {format.name}
                        </h3>
                        <p className="text-xs text-gray-400 text-center">
                          {format.width} x {format.height}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleContinue}
                      disabled={!selectedFormat}
                      className={`px-8 py-3 rounded-lg font-medium ${
                        selectedFormat
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-600 text-gray-300 cursor-not-allowed"
                      } transition-all duration-300`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : currentScreen === "input" ? (
          <div className="animate-fade-in">
            <div className="flex items-center mb-8">
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                title="Retour à la création"
                aria-label="Retour à la création"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold ml-4">Input to Ad</h1>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <label className="block text-gray-300 mb-2">
                  Provide context about your Ad
                </label>
                <textarea
                  value={adInput}
                  onChange={(e) => setAdInput(e.target.value)}
                  className="w-full h-40 bg-[#1E1F23] text-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Create an ad for Serenity Spa, showcasing our luxurious spa treatments for relaxation."
                />
              </div>

              <div>
                <h3 className="text-gray-300 mb-4">Try something like</h3>
                <div className="space-y-3">
                  {adSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => setAdInput(suggestion.text)}
                      className="bg-[#1E1F23] p-4 rounded-lg cursor-pointer hover:bg-[#2A2B31] transition-all duration-200"
                    >
                      <p className="text-gray-300 text-sm">{suggestion.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentScreen("content")}
                  disabled={!adInput.trim()}
                  className={`px-8 py-3 rounded-lg font-medium ${
                    adInput.trim()
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-600 text-gray-300 cursor-not-allowed"
                  } transition-all duration-300`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center mb-8">
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                title="Retour à la création"
                aria-label="Retour à la création"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold ml-4">Content Settings</h1>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <label className="block text-gray-300 mb-2">Image Prompt</label>
                <textarea
                  value={contentSettings.imagePrompt}
                  onChange={(e) =>
                    handleSettingsChange("imagePrompt", e.target.value)
                  }
                  className="w-full h-40 bg-[#1E1F23] text-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your image prompt here"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="changeManually"
                  checked={contentSettings.changeManually}
                  onChange={(e) =>
                    handleSettingsChange("changeManually", e.target.checked)
                  }
                  className="form-checkbox h-4 w-4 text-blue-500"
                  aria-label="Change content manually"
                />
                <label htmlFor="changeManually" className="text-gray-300">
                  Change Manually
                </label>
              </div>

              {contentSettings.changeManually && (
                <div className="animate-fade-in space-y-6 mt-6">
                  <div>
                    <label
                      htmlFor="headline"
                      className="block text-gray-300 mb-2"
                    >
                      Headline
                    </label>
                    <input
                      id="headline"
                      type="text"
                      value={contentSettings.headline}
                      onChange={(e) =>
                        handleSettingsChange("headline", e.target.value)
                      }
                      className="w-full bg-[#1E1F23] text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter headline"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subheading"
                      className="block text-gray-300 mb-2"
                    >
                      Subheading
                    </label>
                    <input
                      id="subheading"
                      type="text"
                      value={contentSettings.subheading}
                      onChange={(e) =>
                        handleSettingsChange("subheading", e.target.value)
                      }
                      className="w-full bg-[#1E1F23] text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter subheading"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="callToAction"
                      className="block text-gray-300 mb-2"
                    >
                      Call to Action
                    </label>
                    <input
                      id="callToAction"
                      type="text"
                      value={contentSettings.callToAction}
                      onChange={(e) =>
                        handleSettingsChange("callToAction", e.target.value)
                      }
                      className="w-full bg-[#1E1F23] text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter call to action"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="discount"
                      className="block text-gray-300 mb-2"
                    >
                      Discount % (Optional)
                    </label>
                    <input
                      id="discount"
                      type="number"
                      value={contentSettings.discount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (
                          value === "" ||
                          (!isNaN(Number(value)) && Number(value) >= 0)
                        ) {
                          handleSettingsChange("discount", value);
                        }
                      }}
                      className="w-20 bg-[#1E1F23] text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-gray-300 font-medium mb-4">
                    Choose Template
                  </h3>
                  <div className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg w-fit">
                    <span className="mr-2">🤖</span>
                    AI-Picked Template
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-300 font-medium mb-4">
                    Number of variants
                  </h3>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="7"
                      step="1"
                      value={contentSettings.numberOfVariants}
                      onChange={(e) =>
                        handleSettingsChange(
                          "numberOfVariants",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      aria-label="Number of content variants"
                    />
                    <div className="absolute w-full flex justify-between -mt-2">
                      <div className="w-1 h-3 bg-gray-700"></div>
                      <div className="w-1 h-3 bg-gray-700"></div>
                      <div className="w-1 h-3 bg-gray-700"></div>
                      <div className="w-1 h-3 bg-gray-700"></div>
                    </div>
                    <div className="flex justify-between text-gray-400 text-sm mt-2">
                      <span>1</span>
                      <span>3</span>
                      <span>5</span>
                      <span>7</span>
                    </div>
                    <div className="absolute -top-6 left-0 right-0 text-center">
                      <span className="text-blue-500 text-sm">
                        {contentSettings.numberOfVariants}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-300 font-medium mb-4">
                  Media for Post
                </h3>
                <div className="flex space-x-4">
                  <button
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      contentSettings.mediaType === "ai-generated"
                        ? "bg-blue-500 text-white"
                        : "bg-[#1E1F23] text-gray-400"
                    }`}
                    onClick={() => {
                      handleSettingsChange("mediaType", "ai-generated");
                      handleSettingsChange("uploadedImage", undefined);
                      handleSettingsChange("uploadedImagePreview", undefined);
                    }}
                  >
                    <span className="mr-2">🤖</span>
                    AI Generated
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      contentSettings.mediaType === "premium-stock"
                        ? "bg-blue-500 text-white"
                        : "bg-[#1E1F23] text-gray-400"
                    }`}
                    onClick={() => {
                      handleSettingsChange("mediaType", "premium-stock");
                      handleSettingsChange("uploadedImage", undefined);
                      handleSettingsChange("uploadedImagePreview", undefined);
                    }}
                  >
                    <span className="mr-2">📸</span>
                    Premium Stock
                  </button>
                  <label
                    className={`px-4 py-2 rounded-lg flex items-center cursor-pointer ${
                      contentSettings.mediaType === "choose-media"
                        ? "bg-blue-500 text-white"
                        : "bg-[#1E1F23] text-gray-400"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      aria-label="Upload image"
                    />
                    <span className="mr-2">➕</span>
                    Choose Media
                  </label>
                </div>

                {/* Affichage de la prévisualisation de l'image */}
                {contentSettings.uploadedImagePreview && (
                  <div className="mt-4 relative">
                    <div className="bg-[#1E1F23] p-4 rounded-lg">
                      <img
                        src={contentSettings.uploadedImagePreview}
                        alt="Image preview"
                        className="max-h-48 rounded-lg mx-auto object-contain"
                      />
                      <div className="flex justify-center mt-4">
                        {!showDeleteConfirm ? (
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center px-3 py-2 text-red-500 hover:text-red-600 transition-colors"
                            aria-label="Supprimer l'image"
                            title="Supprimer l'image"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Supprimer
                          </button>
                        ) : (
                          <div className="flex items-center space-x-4">
                            <p className="text-red-500">
                              Souhaitez-vous vraiment supprimer ce média ?
                            </p>
                            <button
                              onClick={() => {
                                handleSettingsChange(
                                  "uploadedImage",
                                  undefined
                                );
                                handleSettingsChange(
                                  "uploadedImagePreview",
                                  undefined
                                );
                                handleSettingsChange(
                                  "mediaType",
                                  "ai-generated"
                                );
                                setShowDeleteConfirm(false);
                              }}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
                            >
                              Oui
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(false)}
                              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                            >
                              Non
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={toggleAdvancedSettings}
                className="text-blue-500 hover:text-blue-400 flex items-center"
              >
                <span className="mr-2">
                  {contentSettings.showAdvancedSettings ? "−" : "+"}
                </span>
                {contentSettings.showAdvancedSettings
                  ? "Hide Settings"
                  : "More Settings"}
              </button>

              <div
                className={`space-y-6 transition-all duration-300 ease-in-out ${
                  contentSettings.showAdvancedSettings
                    ? "opacity-100 max-h-[500px] translate-y-0"
                    : "opacity-0 max-h-0 translate-y-[-20px] overflow-hidden"
                }`}
              >
                <div>
                  <h3 className="text-gray-300 font-medium mb-4">
                    Caption Length
                  </h3>
                  <div className="flex space-x-4">
                    <button
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        contentSettings.captionLength === "short"
                          ? "bg-blue-500 text-white"
                          : "bg-[#1E1F23] text-gray-400"
                      }`}
                      onClick={() =>
                        handleSettingsChange("captionLength", "short")
                      }
                    >
                      <span className="mr-2">📝</span>
                      Short
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        contentSettings.captionLength === "medium"
                          ? "bg-blue-500 text-white"
                          : "bg-[#1E1F23] text-gray-400"
                      }`}
                      onClick={() =>
                        handleSettingsChange("captionLength", "medium")
                      }
                    >
                      <span className="mr-2">📄</span>
                      Medium
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        contentSettings.captionLength === "long"
                          ? "bg-blue-500 text-white"
                          : "bg-[#1E1F23] text-gray-400"
                      }`}
                      onClick={() =>
                        handleSettingsChange("captionLength", "long")
                      }
                    >
                      <span className="mr-2">📑</span>
                      Long
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-300 font-medium mb-4">
                    Color Palette
                  </h3>
                  <div className="flex space-x-4">
                    <button
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        colorPaletteType === "ai_suggested"
                          ? "bg-blue-500 text-white"
                          : "bg-[#1E1F23] text-gray-400"
                      }`}
                      onClick={() => setColorPaletteType("ai_suggested")}
                    >
                      <span className="mr-2">🎨</span>
                      AI Suggested
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        colorPaletteType === "custom"
                          ? "bg-blue-500 text-white"
                          : "bg-[#1E1F23] text-gray-400"
                      }`}
                      onClick={() => setColorPaletteType("custom")}
                    >
                      <span className="mr-2">🖌️</span>
                      Custom
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleGenerateAd}
                  className="px-8 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Generate Content
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlexAgent;
