// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Validation functions
const validateEmail = (email: string): string => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email)
    ? ""
    : "Invalid email format (e.g., example@domain.com)";
};

const validateIC = (ic: string): string => {
  const re = /^\d{12}$/;
  return re.test(ic)
    ? ""
    : "Invalid IC format. Must be exactly 12 digits (e.g., 123456789012).";
};

const validateTeamName = (
  teamName: string,
  existingTeams: string[]
): string => {
  if (!teamName.trim()) return "Team name is required.";

  const normalizedInput = teamName.toUpperCase().replace(/\s+/g, "");
  const forbiddenNames = ["BUGCRUSHER"];

  if (forbiddenNames.includes(normalizedInput)) {
    return "Team name cannot be 'Bug Crusher' or its variations.";
  }

  for (const existing of existingTeams) {
    const normalizedExisting = existing.toUpperCase().replace(/\s+/g, "");
    if (
      normalizedInput === normalizedExisting ||
      normalizedInput.includes(normalizedExisting) ||
      normalizedExisting.includes(normalizedInput)
    ) {
      return `Team name is too similar to an existing team: "${existing}".`;
    }
  }

  return "";
};

const ProgressIndicator = ({ currentStep, totalSteps }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between relative">
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="relative flex items-center justify-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 ${
              i < currentStep
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 border-2 border-gray-200"
            }`}
          >
            {i + 1}
          </div>
          {i < currentStep - 1 && (
            <div
              className="absolute h-1 bg-indigo-600"
              style={{
                width: `calc(100% - 2.5rem)`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

const states = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Kuala Lumpur",
  "Labuan",
  "Putrajaya",
];

const races = [
  "Melayu",
  "Cina",
  "India",
  "Iban",
  "Bidayuh",
  "Melanau",
  "Kayan",
  "Kenyah",
  "Kelabit",
  "Lun Bawang",
  "Bisaya",
  "Kajang",
  "Penan",
  "Lain-lain bumiputra",
  "Lain-lain kaum",
];

const primaryGrades = [
  "Primary 6 (12 years old)",
  "Primary 5 (11 years old)",
  "Primary 4 (10 years old)",
];

const secondaryGrades = [
  "Form 1 (13 years old)",
  "Form 2 (14 years old)",
  "Form 3 (15 years old)",
];

const codingExperiences = [
  "None",
  "Scratch",
  "Mblock",
  "Python",
  "JavaScript",
  "HTML/CSS",
  "Other",
];

const sizes = [
  { label: '3XS - 32"', value: "3xs" },
  { label: '2XS - 34"', value: "2xs" },
  { label: 'XS - 36"', value: "xs" },
  { label: 'S - 38"', value: "s" },
  { label: 'M - 40"', value: "m" },
  { label: 'L - 42"', value: "l" },
  { label: 'XL - 44"', value: "xl" },
  { label: '2XL - 46"', value: "2xl" },
  { label: '3XL - 48"', value: "3xl" },
];

const categoryOptions = ["Junior-Scratch", "Senior-HTML"];
const categoryToEducationLevel: Record<string, string> = {
  "Junior-Scratch": "Primary",
  "Senior-HTML": "Secondary",
};

const normalizeCategory = (category: string) =>
  (category || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .trim();

const normalizeState = (state: string) =>
  (state || "").toLowerCase().replace(/\s+/g, " ").trim();

type SchoolRecord = {
  id?: string | number;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  category: string;
  raw: Record<string, any>;
};

type SchoolColumnMap = {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  category: string;
  code?: string;
  district?: string;
};

type AddSchoolContext =
  | { target: "team" }
  | { target: "teacher" }
  | { target: "member"; memberIndex: number };

type NewSchoolForm = {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  category: string;
  code?: string;
  district?: string;
};

interface FormData {
  teamName: string;
  representingSchool: string;
  schoolName: string;
  schoolAddress: string;
  postalCode: string;
  educationLevel: string;
  category: string;
  city: string;
  state: string;
  teacherName: string;
  teacherEmail: string;
  teacherPhone: string;
  teacherSchoolName: string;
  size: string;
  teacherIC: string;
  teacherGender: string;
  teacherRace: string;
  teamMembers: Array<{
    name: string;
    ic: string;
    gender: string;
    race: string;
    grade: string;
    schoolName: string;
    parentName: string;
    parentPhone: string;
    studentEmail: string;
    size: string;
    codingExperience: string;
  }>;
}

const initialFormData: FormData = {
  teamName: "",
  representingSchool: "",
  schoolName: "",
  schoolAddress: "",
  postalCode: "",
  educationLevel: "",
  category: "",
  city: "",
  state: "",
  teacherName: "",
  teacherEmail: "",
  teacherPhone: "",
  teacherSchoolName: "",
  size: "",
  teacherIC: "",
  teacherGender: "",
  teacherRace: "",
  teamMembers: Array(3)
    .fill({})
    .map(() => ({
      name: "",
      ic: "",
      gender: "",
      race: "",
      grade: "",
      schoolName: "",
      parentName: "",
      parentPhone: "",
      studentEmail: "",
      size: "",
      codingExperience: "",
    })),
};

export default function SignUp() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [existingTeamNames, setExistingTeamNames] = useState<string[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [schools, setSchools] = useState<SchoolRecord[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [schoolsError, setSchoolsError] = useState("");
  const [teacherState, setTeacherState] = useState("");
  const [memberStates, setMemberStates] = useState<string[]>(["", "", ""]);
  const [teamSchoolSearch, setTeamSchoolSearch] = useState("");
  const [teacherSchoolSearch, setTeacherSchoolSearch] = useState("");
  const [memberSchoolSearches, setMemberSchoolSearches] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [addSchoolContext, setAddSchoolContext] = useState<AddSchoolContext | null>(null);
  const [newSchool, setNewSchool] = useState<NewSchoolForm>({
    name: "",
    address: "",
    postalCode: "",
    city: "",
    state: "",
    category: "",
    code: "",
    district: "",
  });
  const [newSchoolErrors, setNewSchoolErrors] = useState<Record<string, string>>({});
  const [schoolColumnMap, setSchoolColumnMap] = useState<SchoolColumnMap | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchExistingTeams = async () => {
      try {
        const response = await fetch("/api/register-team", {
          method: "GET",
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.teams)) {
          setExistingTeamNames(data.teams.map((team: any) => team.teamName));
        }
      } catch (error) {
        console.error("Failed to fetch existing team names:", error);
      }
    };
    fetchExistingTeams();
  }, []);

  const getFieldValue = (row: Record<string, any>, keys: string[]) => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null && `${row[key]}`.trim()) {
        return row[key];
      }
    }
    const normalizedMap: Record<string, string> = {};
    Object.keys(row).forEach((k) => {
      normalizedMap[k.toLowerCase().replace(/\s+/g, "")] = k;
    });
    for (const key of keys) {
      const normalized = key.toLowerCase().replace(/\s+/g, "");
      if (normalizedMap[normalized]) {
        return row[normalizedMap[normalized]];
      }
    }
    return "";
  };

  const deriveSchoolColumnMap = (row: Record<string, any>): SchoolColumnMap => {
    const resolveKey = (variants: string[], fallback: string) => {
      const found = variants.find((variant) => Object.prototype.hasOwnProperty.call(row, variant));
      if (found) return found;
      const normalizedMap: Record<string, string> = {};
      Object.keys(row).forEach((k) => {
        normalizedMap[k.toLowerCase().replace(/\s+/g, "")] = k;
      });
      for (const variant of variants) {
        const normalized = variant.toLowerCase().replace(/\s+/g, "");
        if (normalizedMap[normalized]) {
          return normalizedMap[normalized];
        }
      }
      return fallback;
    };

    return {
      name: resolveKey(["Name of School", "name_of_school", "school_name", "name"], "name_of_school"),
      address: resolveKey(
        ["Correspondence Address", "correspondence_address", "address", "school_address"],
        "correspondence_address"
      ),
      postalCode: resolveKey(["Poscode", "postal_code", "postcode", "poscode"], "poscode"),
      city: resolveKey(["City", "city"], "city"),
      state: resolveKey(["State", "state"], "state"),
      category: resolveKey(["CATEGORY", "category"], "category"),
      code: resolveKey(["School Code", "school_code", "schoolcode"], "school_code"),
      district: resolveKey(["Education District", "education_district"], "education_district"),
    };
  };

  const mapSchoolRow = (row: Record<string, any>): SchoolRecord => ({
    id: row.id || row.ID || row.school_id || row.SCHOOL_ID,
    name: `${getFieldValue(row, ["Name of School", "name_of_school", "school_name", "name"])}`.trim(),
    address: `${getFieldValue(row, ["Correspondence Address", "correspondence_address", "address", "school_address"])}`.trim(),
    postalCode: `${getFieldValue(row, ["Poscode", "postal_code", "postcode", "poscode"])}`.trim(),
    city: `${getFieldValue(row, ["City", "city"])}`.trim(),
    state: `${getFieldValue(row, ["State", "state"])}`.trim(),
    category: `${getFieldValue(row, ["CATEGORY", "category"])}`.trim(),
    raw: row,
  });

  const loadSchools = async () => {
    setSchoolsLoading(true);
    setSchoolsError("");
    try {
      const pageSize = 1000;
      let from = 0;
      let allRows: any[] = [];

      while (true) {
        const { data, error } = await supabase
          .from("schools")
          .select("*")
          .order("id", { ascending: true })
          .range(from, from + pageSize - 1);

        if (error) {
          setSchoolsError(error.message || "Failed to fetch schools.");
          toast({
            title: "Failed to load schools",
            description: error.message || "Please try again later.",
            variant: "destructive",
          });
          return;
        }

        const rows = Array.isArray(data) ? data : [];
        if (rows.length === 0) {
          break;
        }

        allRows = allRows.concat(rows);

        if (rows.length < pageSize) {
          break;
        }

        from += pageSize;
      }

      if (allRows.length > 0) {
        setSchoolColumnMap(deriveSchoolColumnMap(allRows[0]));
      }
      setSchools(allRows.map(mapSchoolRow).filter((school) => school.name));
    } catch (error) {
      console.error("Failed to fetch schools:", error);
      setSchoolsError("Failed to fetch schools.");
      toast({
        title: "Failed to load schools",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSchoolsLoading(false);
    }
  };

  useEffect(() => {
    loadSchools();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (index !== undefined) {
        const updatedTeamMembers = [...prev.teamMembers];
        updatedTeamMembers[index] = {
          ...updatedTeamMembers[index],
          [name]: value,
        };
        return { ...prev, teamMembers: updatedTeamMembers };
      }
      return { ...prev, [name]: value };
    });

    // Validate immediately
    let errorMsg = "";
    if (name === "teamName") {
      errorMsg = validateTeamName(value, existingTeamNames);
    } else if (name.includes("Email")) {
      errorMsg = validateEmail(value);
    } else if (name === "ic" || name === "teacherIC") {
      errorMsg = validateIC(value);
    }

    setErrors((prev) => ({
      ...prev,
      [index !== undefined ? `${name}-${index}` : name]: errorMsg,
    }));
  };

  const setFormValue = (name: string, value: string, index?: number) => {
    setFormData((prev) => {
      if (index !== undefined) {
        const updatedTeamMembers = [...prev.teamMembers];
        updatedTeamMembers[index] = {
          ...updatedTeamMembers[index],
          [name]: value,
        };
        return { ...prev, teamMembers: updatedTeamMembers };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSelectChange = (
    value: string,
    name: string,
    index?: number,
    allowEmpty = false
  ) => {
    // Prevent saving empty values - this is a workaround for shadcn Select component
    // firing onChange with empty string when options change
    if (!allowEmpty && (!value || value === "")) {
      return;
    }
    setFormValue(name, value, index);
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      representingSchool: value,
      schoolName: value === "yes" ? prev.schoolName : "",
      schoolAddress: value === "yes" ? prev.schoolAddress : "",
      postalCode: value === "yes" ? prev.postalCode : "",
      city: value === "yes" ? prev.city : "",
      state: value === "yes" ? prev.state : "",
      teacherSchoolName: value === "no" ? prev.teacherSchoolName : "",
      teamMembers:
        value === "yes"
          ? prev.teamMembers.map((member) => ({ ...member, schoolName: "" }))
          : prev.teamMembers,
    }));
    if (value === "no") {
      setTeacherState("");
      setMemberStates(["", "", ""]);
    }
  };

  const handleCategoryChange = (value: string) => {
    handleSelectChange(value, "category");
    const educationLevel = categoryToEducationLevel[value] || "";
    setFormData((prev) => ({
      ...prev,
      category: value,
      educationLevel,
      representingSchool: "",
      schoolName: "",
      schoolAddress: "",
      postalCode: "",
      city: "",
      state: "",
    }));
    setTeacherState("");
    setMemberStates(["", "", ""]);
    setTeamSchoolSearch("");
    setTeacherSchoolSearch("");
    setMemberSchoolSearches(["", "", ""]);
  };

  const handleTeamSchoolSelect = (value: string) => {
    handleSelectChange(value, "schoolName");
    const selected = schools.find((school) => school.name === value);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        schoolName: selected.name,
        schoolAddress: selected.address,
        postalCode: selected.postalCode,
        city: selected.city,
      }));
    }
    setTeamSchoolSearch("");
  };

  const handleTeacherSchoolSelect = (value: string) => {
    handleSelectChange(value, "teacherSchoolName");
    setTeacherSchoolSearch("");
  };

  const handleMemberSchoolSelect = (value: string, index: number) => {
    handleSelectChange(value, "schoolName", index);
    setMemberSchoolSearches((prev) => {
      const updated = [...prev];
      updated[index] = "";
      return updated;
    });
  };

  const getFilteredSchools = (state: string, category: string) => {
    if (!state || !category) return [];
    const normalizedCategory = normalizeCategory(category);
    const normalizedState = normalizeState(state);
    return schools
      .filter(
        (school) =>
          normalizeCategory(school.category) === normalizedCategory &&
          normalizeState(school.state) === normalizedState
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const filterSchoolsByQuery = (list: SchoolRecord[], query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((school) => school.name.toLowerCase().includes(q));
  };

  const openAddSchoolModal = (context: AddSchoolContext) => {
    setAddSchoolContext(context);
    const initialState =
      context.target === "team"
        ? formData.state
        : context.target === "teacher"
        ? teacherState
        : memberStates[context.memberIndex] || "";

    setNewSchool({
      name: "",
      address: "",
      postalCode: "",
      city: "",
      state: initialState,
      category: formData.category,
      code: "",
      district: "",
    });
    setNewSchoolErrors({}); // Clear any previous errors
    setShowAddSchoolModal(true);
  };

  const handleAddSchoolSubmit = async () => {
    const missingFields: string[] = [];
    const fieldErrors: Record<string, string> = {};
    
    if (!newSchool.name) {
      missingFields.push("name");
      fieldErrors.name = "School name is required";
    }
    if (!newSchool.address) {
      missingFields.push("address");
      fieldErrors.address = "Address is required";
    }
    if (!newSchool.postalCode) {
      missingFields.push("postal code");
      fieldErrors.postalCode = "Postal code is required";
    }
    if (!newSchool.city) {
      missingFields.push("city");
      fieldErrors.city = "City is required";
    }
    if (!newSchool.state) {
      missingFields.push("state");
      fieldErrors.state = "State is required";
    }
    if (!newSchool.category) {
      missingFields.push("category");
      fieldErrors.category = "Category is required";
    }

    if (missingFields.length > 0) {
      setNewSchoolErrors(fieldErrors);
      toast({
        title: "Submission Failed",
        description: `Missing required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }
    
    setNewSchoolErrors({}); // Clear errors if validation passes

    const columnMap: SchoolColumnMap = schoolColumnMap || {
      name: "name_of_school",
      address: "correspondence_address",
      postalCode: "poscode",
      city: "city",
      state: "state",
      category: "category",
      code: "school_code",
      district: "education_district",
    };

    const payload: Record<string, any> = {
      [columnMap.name]: newSchool.name,
      [columnMap.address]: newSchool.address,
      [columnMap.postalCode]: newSchool.postalCode,
      [columnMap.city]: newSchool.city,
      [columnMap.state]: newSchool.state,
      [columnMap.category]: normalizeCategory(newSchool.category),
    };

    if (columnMap.code && newSchool.code) {
      payload[columnMap.code] = newSchool.code;
    }
    if (columnMap.district && newSchool.district) {
      payload[columnMap.district] = newSchool.district;
    }

    try {
      const { error } = await supabase.from("schools").insert([payload]);
      if (error) {
        toast({
          title: "Failed to add school",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
        return;
      }

      await loadSchools();
      if (addSchoolContext) {
        if (addSchoolContext.target === "team") {
          handleTeamSchoolSelect(newSchool.name);
        } else if (addSchoolContext.target === "teacher") {
          handleTeacherSchoolSelect(newSchool.name);
        } else {
          handleMemberSchoolSelect(newSchool.name, addSchoolContext.memberIndex);
        }
      }
      setShowAddSchoolModal(false);
    } catch (error) {
      console.error("Failed to add school:", error);
      toast({
        title: "Failed to add school",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = getStepErrors(currentStep);
    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) {
      setIsLoading(false);
      return;
    }

    try {
      // If not representing a school, use teacher's state and city
      let finalState = formData.state;
      let finalCity = formData.city;
      
      if (formData.representingSchool === "no") {
        finalState = teacherState;
        // Get city from teacher's selected school
        const teacherSchool = schools.find((school) => school.name === formData.teacherSchoolName);
        finalCity = teacherSchool ? teacherSchool.city : "";
      }

      const formattedData = {
        ...formData,
        state: finalState,
        city: finalCity,
        teamMembers: formData.teamMembers,
        registrationStatus: "Pending",
      };

      const registerResponse = await fetch("/api/register-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setIsError(registerData.error);
        throw new Error(registerData.error);
      }

      setExistingTeamNames((prev) => [...prev, formData.teamName]);

      // Email sending is disabled - users will track status at /status page
      setIsSuccess(true);
      setShowResultModal(true);
    } catch (error) {
      console.error("Submission failed:", error);
      setIsSuccess(false);
      setShowResultModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setAnimate(false);
    if (isSuccess) {
      router.push("/status");
    }
  };

  const nextStep = () => {
    const stepErrors = getStepErrors(currentStep);
    setErrors(stepErrors);
    if (Object.values(stepErrors).some((err) => err)) {
      return;
    }
    setCurrentStep((prevStep) => prevStep + 1);
    scrollToTop();
  };

  const prevStep = () => {
    // Reset terms agreement when navigating away from page 6
    if (currentStep === 6) {
      setAgreeToTerms(false);
    }
    setCurrentStep((prevStep) => prevStep - 1);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStepErrors = (step: number): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case 1:
        if (!formData.teamName) newErrors.teamName = "Team name is required.";
        else
          newErrors.teamName = validateTeamName(
            formData.teamName,
            existingTeamNames
          );
        if (!formData.category) newErrors.category = "Category is required.";
        if (!formData.educationLevel)
          newErrors.educationLevel = "Education level is required.";
        if (!formData.representingSchool)
          newErrors.representingSchool = "Please select an option.";
        if (formData.representingSchool === "yes") {
          if (!formData.state) newErrors.state = "State is required.";
          if (!formData.schoolName)
            newErrors.schoolName = "School name is required.";
          if (!formData.schoolAddress)
            newErrors.schoolAddress = "School address is required.";
          if (!formData.postalCode)
            newErrors.postalCode = "Postal code is required.";
          if (!formData.city) newErrors.city = "City is required.";
        }
        break;
      case 2:
        if (!formData.teacherName)
          newErrors.teacherName = "Teacher name is required.";
        if (!formData.teacherIC)
          newErrors.teacherIC = "Teacher IC is required.";
        else newErrors.teacherIC = validateIC(formData.teacherIC);
        if (!formData.teacherEmail)
          newErrors.teacherEmail = "Teacher email is required.";
        else newErrors.teacherEmail = validateEmail(formData.teacherEmail);
        if (!formData.teacherPhone)
          newErrors.teacherPhone = "Teacher phone is required.";
        if (!formData.teacherGender)
          newErrors.teacherGender = "Teacher gender is required.";
        if (!formData.teacherRace)
          newErrors.teacherRace = "Teacher race is required.";
        if (!formData.size) newErrors.size = "T-shirt size is required.";
        if (
          formData.representingSchool === "no" &&
          !formData.teacherSchoolName
        ) {
          newErrors.teacherSchoolName = "School name is required.";
        }
        if (formData.representingSchool === "no" && !teacherState) {
          newErrors.teacherState = "State is required.";
        }
        break;
      case 3:
      case 4:
      case 5:
        const index = step - 3;
        const member = formData.teamMembers[index];
        if (!member.name) newErrors[`name-${index}`] = "Name is required.";
        if (!member.ic) newErrors[`ic-${index}`] = "IC is required.";
        else newErrors[`ic-${index}`] = validateIC(member.ic);
        if (!member.gender)
          newErrors[`gender-${index}`] = "Gender is required.";
        if (!member.race) newErrors[`race-${index}`] = "Race is required.";
        if (!member.grade) newErrors[`grade-${index}`] = "Grade is required.";
        if (!member.size)
          newErrors[`size-${index}`] = "T-shirt size is required.";
        if (!member.parentName)
          newErrors[`parentName-${index}`] = "Parent name is required.";
        if (!member.parentPhone)
          newErrors[`parentPhone-${index}`] = "Parent phone is required.";
        if (!member.studentEmail)
          newErrors[`studentEmail-${index}`] = "Student email is required.";
        else
          newErrors[`studentEmail-${index}`] = validateEmail(member.studentEmail);
        if (formData.representingSchool === "no" && !member.schoolName) {
          newErrors[`schoolName-${index}`] = "School name is required.";
        }
        if (formData.representingSchool === "no" && !memberStates[index]) {
          newErrors[`memberState-${index}`] = "State is required.";
        }
        break;
      case 6:
        if (!agreeToTerms)
          newErrors.terms = "You must agree to the terms and conditions.";
        break;
    }
    return newErrors;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Team Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <InputField
                label="Team Name"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                required={true}
                error={errors.teamName}
              />
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="text-xs text-gray-500">
                  Junior is primary school, Senior is secondary school.
                </div>
                <Select
                  value={
                    formData.category && formData.category !== ""
                      ? formData.category
                      : ""
                  }
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger
                    id="category"
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <div className="text-red-600 text-sm">{errors.category}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Representing School</Label>
                <RadioGroup
                  name="representingSchool"
                  value={formData.representingSchool}
                  onValueChange={handleRadioChange}
                  className="flex flex-col space-y-1"
                  disabled={!formData.category}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="representingSchoolYes" />
                    <Label htmlFor="representingSchoolYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="representingSchoolNo" />
                    <Label htmlFor="representingSchoolNo">No</Label>
                  </div>
                </RadioGroup>
                {errors.representingSchool && (
                  <div className="text-red-600 text-sm">{errors.representingSchool}</div>
                )}
              </div>
              {formData.representingSchool === "yes" && (
                <>
                  <SelectField
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        state: value,
                        schoolName: "",
                        schoolAddress: "",
                        postalCode: "",
                        city: "",
                      }))
                    }
                    options={states}
                    required={true}
                    error={errors.state}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <div className="flex gap-2">
                      <Select
                        value={
                          formData.schoolName && formData.schoolName !== ""
                            ? formData.schoolName
                            : ""
                        }
                        onValueChange={handleTeamSchoolSelect}
                        disabled={!formData.state || schoolsLoading}
                      >
                        <SelectTrigger
                          id="schoolName"
                          className={errors.schoolName ? "border-red-500" : ""}
                        >
                          <SelectValue
                            placeholder={
                              schoolsLoading
                                ? "Loading schools..."
                                : formData.state
                                ? "Select a school"
                                : "Select state first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2">
                            <Input
                              placeholder="Search schools..."
                              value={teamSchoolSearch}
                              onChange={(e) => setTeamSchoolSearch(e.target.value)}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          </div>
                          {filterSchoolsByQuery(
                            getFilteredSchools(formData.state, formData.category),
                            teamSchoolSearch
                          ).map((school) => (
                            <SelectItem key={school.name} value={school.name}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openAddSchoolModal({ target: "team" })}
                        disabled={!formData.category || !formData.state}
                        className="whitespace-nowrap"
                      >
                        Add school
                      </Button>
                    </div>
                    {errors.schoolName && (
                      <div className="text-red-600 text-sm">
                        {errors.schoolName}
                      </div>
                    )}
                    {schoolsError && (
                      <div className="text-red-600 text-sm">{schoolsError}</div>
                    )}
                  </div>
                  <InputField
                    label="School Address"
                    name="schoolAddress"
                    value={formData.schoolAddress}
                    onChange={handleChange}
                    required={true}
                    error={errors.schoolAddress}
                    readOnly={true}
                    disabled={true}
                  />
                  <InputField
                    label="Postal Code"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required={true}
                    error={errors.postalCode}
                    readOnly={true}
                    disabled={true}
                  />
                  <InputField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required={true}
                    error={errors.city}
                    readOnly={true}
                    disabled={true}
                  />
                </>
              )}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Teacher Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <InputField
                label="Teacher Name"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleChange}
                required={true}
                error={errors.teacherName}
              />
              <InputField
                label="Teacher IC"
                name="teacherIC"
                value={formData.teacherIC}
                onChange={handleChange}
                required={true}
                error={errors.teacherIC}
              />
              <InputField
                label="Teacher Email"
                name="teacherEmail"
                type="email"
                value={formData.teacherEmail}
                onChange={handleChange}
                required={true}
                error={errors.teacherEmail}
              />
              <InputField
                label="Teacher Phone"
                name="teacherPhone"
                type="tel"
                value={formData.teacherPhone}
                onChange={handleChange}
                required={true}
                error={errors.teacherPhone}
              />
              <SelectField
                label="Teacher Gender"
                name="teacherGender"
                value={formData.teacherGender}
                onChange={(value) => handleSelectChange(value, "teacherGender")}
                options={["Male", "Female"]}
                required={true}
              />
              <SelectField
                label="Teacher Race"
                name="teacherRace"
                value={formData.teacherRace}
                onChange={(value) => handleSelectChange(value, "teacherRace")}
                options={races}
                required={true}
              />
              {formData.representingSchool === "no" && (
                <>
                  <SelectField
                    label="State"
                    name="teacherState"
                    value={teacherState}
                    onChange={(value) => {
                      setTeacherState(value);
                      setFormData((prev) => ({
                        ...prev,
                        teacherSchoolName: "",
                      }));
                    }}
                    options={states}
                    required={true}
                    error={errors.teacherState}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="teacherSchoolName">School Name</Label>
                    <div className="flex gap-2">
                      <Select
                        value={
                          formData.teacherSchoolName && formData.teacherSchoolName !== ""
                            ? formData.teacherSchoolName
                            : ""
                        }
                        onValueChange={handleTeacherSchoolSelect}
                        disabled={!teacherState || schoolsLoading}
                      >
                        <SelectTrigger
                          id="teacherSchoolName"
                          className={errors.teacherSchoolName ? "border-red-500" : ""}
                        >
                          <SelectValue
                            placeholder={
                              schoolsLoading
                                ? "Loading schools..."
                                : teacherState
                                ? "Select a school"
                                : "Select state first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2">
                            <Input
                              placeholder="Search schools..."
                              value={teacherSchoolSearch}
                              onChange={(e) => setTeacherSchoolSearch(e.target.value)}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          </div>
                          {filterSchoolsByQuery(
                            getFilteredSchools(teacherState, formData.category),
                            teacherSchoolSearch
                          ).map((school) => (
                            <SelectItem key={school.name} value={school.name}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openAddSchoolModal({ target: "teacher" })}
                        disabled={!formData.category || !teacherState}
                        className="whitespace-nowrap"
                      >
                        Add school
                      </Button>
                    </div>
                    {errors.teacherSchoolName && (
                      <div className="text-red-600 text-sm">{errors.teacherSchoolName}</div>
                    )}
                  </div>
                </>
              )}
              <div className="flex flex-col">
                <SelectField
                  label="T-Shirt Size"
                  name="size"
                  value={formData.size}
                  onChange={(value) => handleSelectChange(value, "size")}
                  options={sizes}
                  required={true}
                />
                <Link
                  href="https://bugcrusher.net/tshirtsize"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-xs text-blue-600 underline hover:text-blue-800"
                >
                  Click here to see the T-shirt sizing.
                </Link>
              </div>
            </div>
          </>
        );
      case 3:
      case 4:
      case 5:
        const memberIndex = currentStep - 3;
        const applicableGrades =
          formData.educationLevel === "Primary"
            ? primaryGrades
            : secondaryGrades;
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Team Member {memberIndex + 1} Information
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {formData.representingSchool === "no" && (
                <>
                  <InputField
                    label="Name"
                    name="name"
                    type="text"
                    value={formData.teamMembers[memberIndex].name}
                    onChange={(e) => handleChange(e, memberIndex)}
                    required={true}
                    error={errors[`name-${memberIndex}`]}
                  />
                  <InputField
                    label="IC"
                    name="ic"
                    type="text"
                    value={formData.teamMembers[memberIndex].ic}
                    onChange={(e) => handleChange(e, memberIndex)}
                    required={true}
                    error={errors[`ic-${memberIndex}`]}
                  />
                  <InputField
                    label="Student Email"
                    name="studentEmail"
                    type="email"
                    value={formData.teamMembers[memberIndex].studentEmail}
                    onChange={(e) => handleChange(e, memberIndex)}
                    required={true}
                    error={errors[`studentEmail-${memberIndex}`]}
                  />
                </>
              )}
              {formData.representingSchool === "yes" && (
                <>
                  <InputField
                    label="Name"
                    name="name"
                    type="text"
                    value={formData.teamMembers[memberIndex].name}
                    onChange={(e) => handleChange(e, memberIndex)}
                    required={true}
                    error={errors[`name-${memberIndex}`]}
                  />
                  <InputField
                    label="IC"
                    name="ic"
                    type="text"
                    value={formData.teamMembers[memberIndex].ic}
                    onChange={(e) => handleChange(e, memberIndex)}
                    required={true}
                    error={errors[`ic-${memberIndex}`]}
                  />
                  <InputField
                    label="Student Email"
                    name="studentEmail"
                    type="email"
                    value={formData.teamMembers[memberIndex].studentEmail}
                    onChange={(e) => handleChange(e, memberIndex)}
                    required={true}
                    error={errors[`studentEmail-${memberIndex}`]}
                  />
                </>
              )}
              <SelectField
                label="Gender"
                name="gender"
                value={formData.teamMembers[memberIndex].gender}
                onChange={(value) =>
                  handleSelectChange(value, "gender", memberIndex)
                }
                options={["Male", "Female"]}
                required={true}
              />
              <SelectField
                label="Race"
                name="race"
                value={formData.teamMembers[memberIndex].race}
                onChange={(value) =>
                  handleSelectChange(value, "race", memberIndex)
                }
                options={races}
                required={true}
              />
              <SelectField
                label="Grade"
                name="grade"
                value={formData.teamMembers[memberIndex].grade}
                onChange={(value) =>
                  handleSelectChange(value, "grade", memberIndex)
                }
                options={applicableGrades}
                required={true}
              />
              {formData.representingSchool === "no" && (
                <>
                  <SelectField
                    label="State"
                    name={`memberState-${memberIndex}`}
                    value={memberStates[memberIndex]}
                    onChange={(value) => {
                      setMemberStates((prev) => {
                        const updated = [...prev];
                        updated[memberIndex] = value;
                        return updated;
                      });
                      setFormData((prev) => {
                        const updatedTeamMembers = [...prev.teamMembers];
                        updatedTeamMembers[memberIndex] = {
                          ...updatedTeamMembers[memberIndex],
                          schoolName: "",
                        };
                        return { ...prev, teamMembers: updatedTeamMembers };
                      });
                    }}
                    options={states}
                    required={true}
                    error={errors[`memberState-${memberIndex}`]}
                  />
                  <div className="space-y-2">
                    <Label htmlFor={`schoolName-${memberIndex}`}>School Name</Label>
                    <div className="flex gap-2">
                      <Select
                        value={
                          formData.teamMembers[memberIndex].schoolName &&
                          formData.teamMembers[memberIndex].schoolName !== ""
                            ? formData.teamMembers[memberIndex].schoolName
                            : ""
                        }
                        onValueChange={(value) => handleMemberSchoolSelect(value, memberIndex)}
                        disabled={!memberStates[memberIndex] || schoolsLoading}
                      >
                        <SelectTrigger
                          id={`schoolName-${memberIndex}`}
                          className={errors[`schoolName-${memberIndex}`] ? "border-red-500" : ""}
                        >
                          <SelectValue
                            placeholder={
                              schoolsLoading
                                ? "Loading schools..."
                                : memberStates[memberIndex]
                                ? "Select a school"
                                : "Select state first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="p-2">
                            <Input
                              placeholder="Search schools..."
                              value={memberSchoolSearches[memberIndex]}
                              onChange={(e) =>
                                setMemberSchoolSearches((prev) => {
                                  const updated = [...prev];
                                  updated[memberIndex] = e.target.value;
                                  return updated;
                                })
                              }
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          </div>
                          {filterSchoolsByQuery(
                            getFilteredSchools(memberStates[memberIndex], formData.category),
                            memberSchoolSearches[memberIndex]
                          ).map((school) => (
                            <SelectItem key={school.name} value={school.name}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openAddSchoolModal({ target: "member", memberIndex })}
                        disabled={!formData.category || !memberStates[memberIndex]}
                        className="whitespace-nowrap"
                      >
                        Add school
                      </Button>
                    </div>
                    {errors[`schoolName-${memberIndex}`] && (
                      <div className="text-red-600 text-sm">{errors[`schoolName-${memberIndex}`]}</div>
                    )}
                  </div>
                </>
              )}
              <div className="flex flex-col">
                <SelectField
                  label="T-Shirt Size"
                  name="size"
                  value={formData.teamMembers[memberIndex].size}
                  onChange={(value) =>
                    handleSelectChange(value, "size", memberIndex)
                  }
                  options={sizes}
                  required={true}
                />
                <Link
                  href="https://bugcrusher.net/tshirtsize"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-xs text-blue-600 underline hover:text-blue-800"
                >
                  Click here to see the T-shirt sizing.
                </Link>
              </div>
              <SelectField
                label="Coding Experience"
                name="codingExperience"
                value={formData.teamMembers[memberIndex].codingExperience}
                onChange={(value) =>
                  handleSelectChange(value, "codingExperience", memberIndex)
                }
                options={codingExperiences}
                required={false}
              />
              <InputField
                label="Parent Name"
                name="parentName"
                type="text"
                value={formData.teamMembers[memberIndex].parentName}
                onChange={(e) => handleChange(e, memberIndex)}
                required={true}
                error={errors[`parentName-${memberIndex}`]}
              />
              <InputField
                label="Parent Phone"
                name="parentPhone"
                type="tel"
                value={formData.teamMembers[memberIndex].parentPhone}
                onChange={(e) => handleChange(e, memberIndex)}
                required={true}
                error={errors[`parentPhone-${memberIndex}`]}
              />
            </div>
          </>
        );
      case 6:
        return (
          <>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Terms and Conditions
            </h3>
            <div className="space-y-4">
              <div className="text-sm text-gray-700">
                I understand and agree that the text, photographs, and/or videos
                containing the words, image and/or voice of all the participants
                above may be used in the production of instructional and/or
                promotional materials produced by or on behalf of Realfun
                Academy Sdn. Bhd. and that such materials may be distributed or
                broadcast to the public and displayed publicly.
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked as boolean)
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              {errors.terms && (
                <div className="text-red-600 text-sm">{errors.terms}</div>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (showResultModal) {
      const timer = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timer);
    }
  }, [showResultModal]);

  return (
    <div className="min-h-[120vh] bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign up for the Hackathon
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ProgressIndicator currentStep={currentStep} totalSteps={6} />
          <form className="space-y-6" onSubmit={handleSubmit}>
            {renderStep()}
            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Previous
                </Button>
              )}
              {currentStep < 6 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={Object.values(getStepErrors(currentStep)).some(
                    (err) => err
                  )}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !agreeToTerms}
                  className="inline-flex justify-center items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      <Dialog open={showAddSchoolModal} onOpenChange={setShowAddSchoolModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a School</DialogTitle>
            <DialogDescription>
              Add your school if it is not listed. The list will refresh after saving.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <InputField
              label="School Name"
              name="newSchoolName"
              value={newSchool.name}
              onChange={(e) => {
                const uppercaseName = e.target.value.toUpperCase();
                setNewSchool((prev) => ({ ...prev, name: uppercaseName }));
                setNewSchoolErrors((prev) => ({ ...prev, name: "" }));
              }}
              required={true}
              error={newSchoolErrors.name}
            />
            <InputField
              label="School Address"
              name="newSchoolAddress"
              value={newSchool.address}
              onChange={(e) => {
                setNewSchool((prev) => ({ ...prev, address: e.target.value }));
                setNewSchoolErrors((prev) => ({ ...prev, address: "" }));
              }}
              required={true}
              error={newSchoolErrors.address}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Postal Code"
                name="newSchoolPostalCode"
                value={newSchool.postalCode}
                onChange={(e) => {
                  setNewSchool((prev) => ({
                    ...prev,
                    postalCode: e.target.value,
                  }));
                  setNewSchoolErrors((prev) => ({ ...prev, postalCode: "" }));
                }}
                required={true}
                error={newSchoolErrors.postalCode}
              />
              <InputField
                label="City"
                name="newSchoolCity"
                value={newSchool.city}
                onChange={(e) => {
                  setNewSchool((prev) => ({ ...prev, city: e.target.value }));
                  setNewSchoolErrors((prev) => ({ ...prev, city: "" }));
                }}
                required={true}
                error={newSchoolErrors.city}
              />
            </div>
            <SelectField
              label="State"
              name="newSchoolState"
              value={newSchool.state}
              onChange={(value) => {
                setNewSchool((prev) => ({ ...prev, state: value }));
                setNewSchoolErrors((prev) => ({ ...prev, state: "" }));
              }}
              options={states}
              required={true}
              error={newSchoolErrors.state}
            />
            <SelectField
              label="Category"
              name="newSchoolCategory"
              value={newSchool.category}
              onChange={(value) =>
                setNewSchool((prev) => ({ ...prev, category: value }))
              }
              options={categoryOptions}
              required={true}
              disabled={true}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="School Code (Optional)"
                name="newSchoolCode"
                value={newSchool.code || ""}
                onChange={(e) =>
                  setNewSchool((prev) => ({ ...prev, code: e.target.value }))
                }
                required={false}
              />
              <InputField
                label="Education District (Optional)"
                name="newSchoolDistrict"
                value={newSchool.district || ""}
                onChange={(e) =>
                  setNewSchool((prev) => ({ ...prev, district: e.target.value }))
                }
                required={false}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAddSchoolModal(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddSchoolSubmit}>
              Save School
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle
                  className={`${
                    isSuccess ? "text-green-500" : "text-red-500"
                  } stroke-current`}
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                {isSuccess ? (
                  <path
                    className={`text-green-500 stroke-current ${
                      animate ? "animate-draw-tick" : ""
                    }`}
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    d="M25,50 L40,65 L75,30"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <>
                    <path
                      className={`text-red-500 stroke-current ${
                        animate ? "animate-draw-cross" : ""
                      }`}
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      d="M25,25 L75,75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      className={`text-red-500 stroke-current ${
                        animate ? "animate-draw-cross" : ""
                      }`}
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      d="M75,25 L25,75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}
              </svg>
            </div>
            <DialogTitle>
              {isSuccess ? "Submission Successful!" : "Submission Failed"}
            </DialogTitle>
            <DialogDescription>
              {isSuccess
                ? "Thank you for signing up for the Hackathon. We've received your registration and will be in touch soon."
                : isError}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseResultModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastProvider>
        <ToastViewport />
      </ToastProvider>

      <style jsx global>{`
        @keyframes draw-tick {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 100;
          }
        }
        .animate-draw-tick {
          animation: draw-tick 0.5s ease-out forwards;
        }
        @keyframes draw-cross {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 100;
          }
        }
        .animate-draw-cross {
          animation: draw-cross 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  error,
  readOnly = false,
  disabled = false,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
      disabled={disabled}
      className={error ? "border-red-500" : ""}
    />
    {error && <div className="text-red-600 text-sm">{error}</div>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  error = "",
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Select 
      value={value && value !== "" ? value : ""} 
      onValueChange={onChange} 
      disabled={disabled}
      >
        <SelectTrigger id={name} className={error ? "border-red-500" : ""}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value || option}
              value={option.value || option}
            >
              {option.label || option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
