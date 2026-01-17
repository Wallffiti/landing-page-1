// @ts-nocheck

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const {
      teamName,
      teacherEmail,
      teacherName,
      teacherPhone,
      teacherIC,
      size,
      representingSchool,
      schoolName,
      schoolAddress,
      postalCode,
      educationLevel,
      category,
      city,
      state,
      teamMembers,
      teacherGender,
      teacherRace,
      teacherSchoolName, // Added for cases where representingSchool is "no"
    } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Styled HTML email content with conditional rendering for nullable fields
    const emailContent = `
<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <title>BugCrusher Hackathon Registration Confirmation</title>
  <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cabin:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
    #MessageViewBody a { color: inherit; text-decoration: none; }
    p { line-height: inherit; }
    .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; }
    .image_block img+div { display: none; }
    sup, sub { font-size: 75%; line-height: 0; }
    @media (max-width:700px) {
      .desktop_hide table.icons-inner, .social_block.desktop_hide .social-table { display: inline-block !important; }
      .icons-inner { text-align: center; }
      .icons-inner td { margin: 0 auto; }
      .image_block div.fullWidth { max-width: 100% !important; }
      .mobile_hide { display: none; }
      .row-content { width: 100% !important; }
      .stack .column { width: 100%; display: block; }
      .mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; }
      .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; }
      .reverse { display: table; width: 100%; }
      .reverse .column.first { display: table-footer-group !important; }
      .reverse .column.last { display: table-header-group !important; }
      .row-3 td.column.first .border { padding: 35px 0 35px 25px; }
      .row-3 td.column.last .border { padding: 0 0 5px; }
    }
  </style>
</head>
<body style="background-color: #f2f2f2; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f2f2f2;" width="100%">
<tbody>
<tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 7px; vertical-align: top;" width="100%">
<div class="spacer_block block-1" style="height:20px;line-height:20px;font-size:1px;"> </div>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
<div class="spacer_block block-1" style="height:7px;line-height:7px;font-size:1px;"> </div>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr class="reverse">
<td class="column column-1 first" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 35px; padding-left: 25px; padding-top: 35px; vertical-align: top;" width="50%">
<div class="border">
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-left:5px;padding-top:10px;text-align:center;width:100%;">
<h1 style="margin: 0; color: #fe7062; direction: ltr; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1px; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 15.6px;">
<span class="tinyMce-placeholder" style="word-break: break-word;">THANK YOU ${teamName}</span></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:5px;padding-right:5px;padding-top:5px;text-align:center;width:100%;">
<h1 style="margin: 0; color: #2f2e41; direction: ltr; font-family: 'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 29px; font-weight: 400; letter-spacing: 1px; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 34.8px;">
<strong>We received your registration!</strong></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:5px;padding-right:5px;padding-top:10px;">
<div style="color:#393d47;direction:ltr;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:15px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;mso-line-height-alt:22.5px;">
<p style="margin: 0;">Your application is currently <strong>PENDING REVIEW</strong>. You will receive a confirmation email once the admin has approved your registration.</p>
</div>
</td>
</tr>
</table>
</div>
</td>
<td class="column column-2 last" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; vertical-align: top;" width="50%">
<div class="border">
<table border="0" cellpadding="45" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment" style="line-height:10px">
<div class="fullWidth" style="max-width: 250px;"><img alt="BugCrusher Logo" src="https://bugcrusher.net/wp-content/uploads/wBClogo2024.png" style="display: block; height: auto; border: 0; width: 100%;" title="BugCrusher Logo" width="250"/></div>
</div>
</td>
</tr>
</table>
</div>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; color: #000000; border-radius: 0; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="33.333333333333336%">
<table border="0" cellpadding="10" cellspacing="0" class="button_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment"><a href="https://bugcrusher.net/briefing/" style="color:#ffffff;text-decoration:none;" target="_blank">
<span class="button" style="background-color: #1268b2; border-bottom: 0px solid transparent; border-left: 0px solid transparent; border-radius: 4px; border-right: 0px solid transparent; border-top: 0px solid transparent; color: #ffffff; display: inline-block; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 16px; font-weight: 400; padding: 5px 20px; text-align: center; word-break: keep-all;"><span style="line-height: 32px;">Watch Briefing</span></span></a></div>
</td>
</tr>
</table>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="33.333333333333336%">
<table border="0" cellpadding="10" cellspacing="0" class="button_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment"><a href="https://challenge.bugcrusher.net/" style="color:#ffffff;text-decoration:none;" target="_blank">
<span class="button" style="background-color: #1268b2; border-bottom: 0px solid transparent; border-left: 0px solid transparent; border-radius: 4px; border-right: 0px solid transparent; border-top: 0px solid transparent; color: #ffffff; display: inline-block; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 16px; font-weight: 400; padding: 5px 20px; text-align: center; word-break: keep-all;"><span style="line-height: 32px;">Check Status</span></span></a></div>
</td>
</tr>
</table>
</td>
<td class="column column-3" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="33.333333333333336%">
<table border="0" cellpadding="10" cellspacing="0" class="button_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment"><a href="https://bugcrusher.net" style="color:#ffffff;text-decoration:none;" target="_blank">
<span class="button" style="background-color: #1268b2; border-bottom: 0px solid transparent; border-left: 0px solid transparent; border-radius: 4px; border-right: 0px solid transparent; border-top: 0px solid transparent; color: #ffffff; display: inline-block; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 16px; font-weight: 400; padding: 5px 20px; text-align: center; word-break: keep-all;"><span style="line-height: 32px;">Visit Website</span></span></a></div>
</td>
</tr>
</table>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; background-size: auto; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-left: 25px; padding-right: 25px; padding-top: 25px; vertical-align: top;" width="100%">
<table border="0" cellpadding="5" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<h1 style="margin: 0; color: #2f2e41; direction: ltr; font-family: 'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 23px; font-weight: 400; letter-spacing: 1px; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;">
<strong>Team Details</strong></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-left:10px;padding-right:5px;padding-top:10px;">
<div style="color:#393d47;direction:ltr;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;">
<p style="margin: 0;">Please contact admin at <a href="mailto:support@bugcrusher.net?subject=Change of Registration Detail" style="color: #8a3b8f;" target="_blank">support@bugcrusher.net</a> or call us at <a href="http://wa.me/+60132208130" style="color: #8a3b8f;" target="_blank">+60132208130</a> if there's any change required.</p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="table_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<table style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; width: 100%; table-layout: fixed; direction: ltr; background-color: transparent; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-weight: 400; color: #101112; text-align: left;" width="100%">
<thead style="vertical-align: top; background-color: #f2f2f2; color: #101112; font-size: 14px; line-height: 120%;">
<tr>
<th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;" width="50%">Team Info</th>
<th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;" width="50%">Details</th>
</tr>
</thead>
<tbody style="vertical-align: top; font-size: 16px; line-height: 120%;">
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Team Name</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${teamName}</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Representing School</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${
      representingSchool === "yes" ? "Yes" : "No"
    }</td>
</tr>
${
  schoolName
    ? `
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">School Name</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${schoolName}</td>
</tr>`
    : ""
}
${
  schoolAddress
    ? `
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">School Address</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${schoolAddress}</td>
</tr>`
    : ""
}
${
  postalCode
    ? `
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Postal Code</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${postalCode}</td>
</tr>`
    : ""
}
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Education Level</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${educationLevel}</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Category</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${category}</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">City</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${city}</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">State</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${state}</td>
</tr>
</tbody>
</table>
</td>
</tr>
</table>
<table border="0" cellpadding="10" cellspacing="0" class="table_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<table style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; width: 100%; table-layout: fixed; direction: ltr; background-color: transparent; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-weight: 400; color: #101112; text-align: left;" width="100%">
<thead style="vertical-align: top; background-color: #f2f2f2; color: #101112; font-size: 14px; line-height: 120%;">
<tr>
<th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Teacher Info</th>
<th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Details</th>
</tr>
</thead>
<tbody style="vertical-align: top; font-size: 16px; line-height: 120%;">
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Name</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${teacherName}</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Email</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${teacherEmail}</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Phone</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${teacherPhone}</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">IC</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${teacherIC}</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Gender</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${teacherGender}</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Race</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${teacherRace}</td>
</tr>
${
  teacherSchoolName
    ? `
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">School Name</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${teacherSchoolName}</td>
</tr>`
    : ""
}
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">T-Shirt Size</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${size}</td>
</tr>
</tbody>
</table>
</td>
</tr>
</table>
${teamMembers
  .map(
    (member, index) => `
<table border="0" cellpadding="10" cellspacing="0" class="table_block block-${
      index + 5
    }" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<table style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; width: 100%; table-layout: fixed; direction: ltr; background-color: transparent; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-weight: 400; color: #101112; text-align: left;" width="100%">
<thead style="vertical-align: top; background-color: #f2f2f2; color: #101112; font-size: 14px; line-height: 120%;">
<tr>
<th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Student ${
      index + 1
    } Info</th>
<th style="padding: 10px; word-break: break-word; font-weight: 700; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Details</th>
</tr>
</thead>
<tbody style="vertical-align: top; font-size: 16px; line-height: 120%;">
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Name</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${
      member.name
    }</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">IC</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${
      member.ic
    }</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Gender</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${
      member.gender
    }</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Race</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${
      member.race
    }</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Grade</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${
      member.grade
    }</td>
</tr>
${
  member.schoolName
    ? `
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">School Name</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${member.schoolName}</td>
</tr>`
    : ""
}
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Parent Name</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${
      member.parentName
    }</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Parent Phone</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${
      member.parentPhone
    }</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Student Email</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${
      member.studentEmail
    }</td>
</tr>
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">T-Shirt Size</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${
      member.size
    }</td>
</tr>
${
  member.codingExperience
    ? `
<tr>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">Coding Experience</td>
<td style="padding: 10px; word-break: break-word; border-top: 1px solid #dddddd; border-right: 1px solid #dddddd; border-bottom: 1px solid #dddddd; border-left: 1px solid #dddddd;">${member.codingExperience}</td>
</tr>`
    : ""
}
</tbody>
</table>
</td>
</tr>
</table>
`
  )
  .join("")}
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-8" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 10px; vertical-align: top;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="button_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
<div align="center" class="alignment"><a href="mailto:support@bugcrusher.net?subject=Request%20To%20Change%20Team%20Details&body=Hi%2C%20%0A%0AI%20would%20like%20to%20change%20my%20team%20details%2C%20please%20assist." style="color:#ffffff;text-decoration:none;" target="_blank">
<span class="button" style="background-color: #1268b2; border-bottom: 0px solid #8a3b8f; border-left: 0px solid #8a3b8f; border-radius: 0px; border-right: 0px solid #8a3b8f; border-top: 0px solid #8a3b8f; color: #ffffff; display: inline-block; font-family: Cabin, Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 14px; font-weight: 400; padding: 5px 35px; text-align: center; word-break: keep-all; letter-spacing: 1px;"><span style="line-height: 28px;"><strong>Request To Change Details</strong></span></span></a></div>
</td>
</tr>
</table>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-9" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top;" width="100%">
<div class="spacer_block block-1" style="height:20px;line-height:20px;font-size:1px;"> </div>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-10" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; background-size: auto; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 25px; padding-right: 25px; padding-top: 25px; vertical-align: top;" width="100%">
<table border="0" cellpadding="5" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<h1 style="margin: 0; color: #2f2e41; direction: ltr; font-family: 'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 23px; font-weight: 400; letter-spacing: 1px; line-height: 120%; text-align: left;">
<strong>What Next?</strong></h1>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:5px;padding-right:5px;padding-top:10px;">
<div style="color:#393d47;direction:ltr;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:left;">
<p style="margin: 0;">For the latest timeline, please visit our website at <a href="https://www.bugcrusher.net" style="color: #8a3b8f;" target="_blank">www.bugcrusher.net</a>:</p>
</div>
</td>
</tr>
</table>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-11" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 10px; padding-top: 5px; vertical-align: top;" width="16.666666666666668%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px">
<div style="max-width: 51.667px;"><img alt="1" src="https://bugcrusher.net/wp-content/uploads/1circle.png" style="display: block; height: auto; border: 0; width: 100%;" width="51.667"/></div>
</div>
</td>
</tr>
</table>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="83.33333333333333%">
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:5px;padding-right:5px;padding-top:10px;text-align:center;width:100%;">
<h1 style="margin: 0; color: #1268b2; direction: ltr; font-family: 'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 17px; font-weight: 400; line-height: 120%; text-align: left;">
<span style="word-break: break-word;"><strong>8-10 April</strong> | Round 1 Workshop (Virtual)</span></h1>
</td>
</tr>
</table>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-12" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 10px; padding-top: 5px; vertical-align: top;" width="16.666666666666668%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px">
<div style="max-width: 51.667px;"><img alt="2" src="https://bugcrusher.net/wp-content/uploads/2circle.png" style="display: block; height: auto; border: 0; width: 100%;" width="51.667"/></div>
</div>
</td>
</tr>
</table>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="83.33333333333333%">
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:5px;padding-right:5px;padding-top:10px;text-align:center;width:100%;">
<h1 style="margin: 0; color: #1268b2; direction: ltr; font-family: 'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 17px; font-weight: 400; line-height: 120%; text-align: left;">
<span style="word-break: break-word;"><strong>30 April</strong> | Round 1 Hackathon (Virtual)</span></h1>
</td>
</tr>
</table>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-13" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 10px; padding-top: 5px; vertical-align: top;" width="16.666666666666668%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px">
<div style="max-width: 51.667px;"><img alt="3" src="https://bugcrusher.net/wp-content/uploads/3circle.png" style="display: block; height: auto; border: 0; width: 100%;" width="51.667"/></div>
</div>
</td>
</tr>
</table>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="83.33333333333333%">
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:5px;padding-right:5px;padding-top:10px;text-align:center;width:100%;">
<h1 style="margin: 0; color: #1268b2; direction: ltr; font-family: 'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 17px; font-weight: 400; line-height: 120%; text-align: left;">
<span style="word-break: break-word;"><strong>20-21 May</strong> | Round 2 / Semi Final Workshop (Virtual)</span></h1>
</td>
</tr>
</table>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 10px; padding-top: 5px; vertical-align: top;" width="16.666666666666668%">
<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
<div align="center" class="alignment" style="line-height:10px">
<div style="max-width: 51.667px;"><img alt="4" src="https://bugcrusher.net/wp-content/uploads/4circle.png" style="display: block; height: auto; border: 0; width: 100%;" width="51.667"/></div>
</div>
</td>
</tr>
</table>
</td>
<td class="column column-2" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="83.33333333333333%">
<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:5px;padding-right:5px;padding-top:10px;text-align:center;width:100%;">
<h1 style="margin: 0; color: #1268b2; direction: ltr; font-family: 'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 17px; font-weight: 400; line-height: 120%; text-align: left;">
<span style="word-break: break-word;"><strong>13 Jun</strong> | Round 2 / Semi Final Hackathon (Virtual)</span></h1>
</td>
</tr>
</table>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-15" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fbfbfb; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 7px; vertical-align: top;" width="100%">
<div class="spacer_block block-1" style="height:25px;line-height:25px;font-size:1px;"> </div>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-16" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 25px; padding-right: 25px; padding-top: 7px; vertical-align: top;" width="100%">
<div class="spacer_block block-1" style="height:30px;line-height:30px;font-size:1px;"> </div>
<table border="0" cellpadding="5" cellspacing="0" class="heading_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<h1 style="margin: 0; color: #575c66; direction: ltr; font-family: 'Cabin', Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 18px; font-weight: 400; letter-spacing: 1px; line-height: 120%; text-align: center;">
<strong>Have any questions? <a href="http://wa.me/+60132208130" style="color: #fe7062;" target="_blank">Contact us!</a></strong></h1>
</td>
</tr>
</table>
<div class="spacer_block block-3" style="height:30px;line-height:30px;font-size:1px;"> </div>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-17" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="100%">
<table border="0" cellpadding="5" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #7B7B7B;"><span style="word-break: break-word;"> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-18" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;">
<div style="color:#39374e;direction:ltr;font-family:Cabin, Arial, Helvetica Neue, Helvetica, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:150%;text-align:center;">
<p style="margin: 0; margin-bottom: 0px;">Stay up-to-date with current activities and future events by following us on your favorite social media channels.</p>
<p style="margin: 0;">Changed your mind? <strong><a href="#" style="color: #fe7062;" target="_blank">Unsubscribe</a></strong></p>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="social_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;text-align:center;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="184px">
<tr>
<td style="padding:0 7px 0 7px;"><a href="https://www.facebook.com/realfunlc" target="_blank"><img alt="Facebook" src="https://bugcrusher.net/wp-content/uploads/facebook2x.png" style="display: block; height: auto; border: 0;" width="32"/></a></td>
<td style="padding:0 7px 0 7px;"><a href="https://www.instagram.com/realfuncentre" target="_blank"><img alt="Instagram" src="https://bugcrusher.net/wp-content/uploads/instagram2x.png" style="display: block; height: auto; border: 0;" width="32"/></a></td>
<td style="padding:0 7px 0 7px;"><a href="https://www.youtube.com/realfunlearningcentre" target="_blank"><img alt="YouTube" src="https://bugcrusher.net/wp-content/uploads/youtube2x.png" style="display: block; height: auto; border: 0;" width="32"/></a></td>
<td style="padding:0 7px 0 7px;"><a href="https://www.bugcrusher.net" target="_blank"><img alt="Web Site" src="https://bugcrusher.net/wp-content/uploads/website2x.png" style="display: block; height: auto; border: 0;" width="32"/></a></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-19" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff;" width="100%">
<tbody><tr><td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 680px; margin: 0 auto;" width="680">
<tbody><tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top;" width="100%">
<div class="spacer_block block-1" style="height:20px;line-height:20px;font-size:1px;"> </div>
</td>
</tr></tbody>
</table>
</td></tr></tbody>
</table>
</td></tr>
</tbody>
</table>
</body>
</html>
    `;

    const recipients = [teacherEmail, ...teamMembers.map((m) => m.studentEmail)];

    // Send email to teacher & team members
    await Promise.all(
      recipients.map((email) =>
        transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@example.com',
          to: email,
          cc: 'support@bugcrusher.net',
          subject: "BugCrusher Hackathon Registration Confirmation",
          html: emailContent,
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
